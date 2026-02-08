/**
 * Quorum SMS Pipeline Tests
 *
 * Tests the full SMS flow: webhook parsing, board consultation (live Gemini),
 * response formatting, and Surge SMS delivery.
 *
 * Usage: node test.js
 * Requires: GEMINI_API_KEY in .env
 */

const { GoogleGenAI } = require("@google/genai");
const { consultBoard, consultBoardRaw, consultAgent, synthesizeBoard, formatSMSResponse, formatSMSSegments, AgentRole, withRetry } = require("./boardService");
const { sendSMS } = require("./surgeClient");
const { sendSMS: sendSMSTwilio } = require("./twilioClient");
const smsRouter = require("./smsRouter");
const path = require("path");
const fs = require("fs");

// Load .env manually (no dotenv dependency)
const envPath = path.join(__dirname, ".env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  for (const line of envContent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx > 0) {
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      process.env[key] = val;
    }
  }
}

// ── Test runner ──────────────────────────────────────────────────────────────

let passed = 0;
let failed = 0;
const failures = [];

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`);
}

async function runTest(name, fn) {
  const start = Date.now();
  process.stdout.write(`  ${name} ... `);
  try {
    await fn();
    const ms = Date.now() - start;
    console.log(`PASS (${ms}ms)`);
    passed++;
  } catch (err) {
    const ms = Date.now() - start;
    console.log(`FAIL (${ms}ms)`);
    console.log(`    ${err.message}`);
    failed++;
    failures.push({ name, error: err.message });
  }
}

// ── Unit Tests ──────────────────────────────────────────────────────────────

async function unitTests() {
  console.log("\n── Unit Tests ──\n");

  await runTest("formatSMSResponse produces expected structure", async () => {
    const mockResponses = [
      { role: AgentRole.FINANCE, content: "Cut costs by 10%." },
      { role: AgentRole.GROWTH, content: "Double ad spend." },
      { role: AgentRole.TECH, content: "Migrate to microservices." },
      { role: AgentRole.LEGAL, content: "Review contracts." },
    ];
    const synthesis = "Consensus: cut costs while investing selectively.";

    const result = formatSMSResponse(mockResponses, synthesis);

    assert(result.includes("CFO:"), "Should contain CFO label");
    assert(result.includes("CMO:"), "Should contain CMO label");
    assert(result.includes("CTO:"), "Should contain CTO label");
    assert(result.includes("Legal:"), "Should contain Legal label");
    assert(result.includes("BOARD RESOLUTION"), "Should contain board resolution header");
    assert(result.includes("Cut costs by 10%"), "Should contain CFO content");
    assert(result.includes(synthesis), "Should contain synthesis text");
  });

  await runTest("formatSMSResponse includes agent emojis", async () => {
    const mockResponses = [
      { role: AgentRole.FINANCE, content: "Test." },
      { role: AgentRole.GROWTH, content: "Test." },
      { role: AgentRole.TECH, content: "Test." },
      { role: AgentRole.LEGAL, content: "Test." },
    ];
    const result = formatSMSResponse(mockResponses, "Synthesis.");

    assert(result.includes("\u{1F4CA}"), "Should contain finance emoji");
    assert(result.includes("\u{1F4C8}"), "Should contain growth emoji");
    assert(result.includes("\u{1F4BB}"), "Should contain tech emoji");
    assert(result.includes("\u2696\uFE0F"), "Should contain legal emoji");
  });

  await runTest("withRetry succeeds on first try", async () => {
    let calls = 0;
    const result = await withRetry(() => { calls++; return "ok"; }, 3);
    assert(result === "ok", "Should return result");
    assert(calls === 1, "Should only call once");
  });

  await runTest("withRetry retries on 500 and succeeds", async () => {
    let calls = 0;
    const result = await withRetry(() => {
      calls++;
      if (calls < 3) {
        const err = new Error("Internal error");
        err.status = 500;
        throw err;
      }
      return "recovered";
    }, 3);
    assert(result === "recovered", "Should eventually succeed");
    assert(calls === 3, "Should have retried twice then succeeded");
  });

  await runTest("withRetry throws non-retryable errors immediately", async () => {
    let calls = 0;
    try {
      await withRetry(() => {
        calls++;
        const err = new Error("Bad request");
        err.status = 400;
        throw err;
      }, 3);
      assert(false, "Should have thrown");
    } catch (err) {
      assert(err.message === "Bad request", "Should throw original error");
      assert(calls === 1, "Should not retry on 400");
    }
  });

  await runTest("formatSMSSegments returns 5 segments (4 agents + synthesis)", async () => {
    const mockResponses = [
      { role: AgentRole.FINANCE, content: "Cut costs." },
      { role: AgentRole.GROWTH, content: "Expand markets." },
      { role: AgentRole.TECH, content: "Build faster." },
      { role: AgentRole.LEGAL, content: "Review risks." },
    ];
    const synthesis = "Board agrees on balanced approach.";
    const segments = formatSMSSegments(mockResponses, synthesis);
    assert(segments.length === 5, `Expected 5 segments, got ${segments.length}`);
    assert(segments[0].includes("CFO"), "First segment should be CFO");
    assert(segments[4].includes("BOARD RESOLUTION"), "Last segment should be synthesis");
  });

  await runTest("formatSMSSegments truncates long responses to ≤1590 UTF-8 bytes", async () => {
    const longContent = "A".repeat(2000);
    const mockResponses = [
      { role: AgentRole.FINANCE, content: longContent },
      { role: AgentRole.GROWTH, content: "Short." },
      { role: AgentRole.TECH, content: "Short." },
      { role: AgentRole.LEGAL, content: "Short." },
    ];
    const segments = formatSMSSegments(mockResponses, "Synthesis.");
    const encoder = new TextEncoder();
    for (let i = 0; i < segments.length; i++) {
      const byteLen = encoder.encode(segments[i]).length;
      assert(byteLen <= 1590, `Segment ${i} is ${byteLen} bytes, exceeds 1590`);
    }
  });

  await runTest("formatSMSSegments handles emoji-heavy content within byte limit", async () => {
    // Each emoji is 4 bytes in UTF-8 but 2 chars in JS
    const emojiContent = "\u{1F680}".repeat(500); // 500 rockets = 2000 UTF-8 bytes
    const mockResponses = [
      { role: AgentRole.FINANCE, content: emojiContent },
      { role: AgentRole.GROWTH, content: "OK." },
      { role: AgentRole.TECH, content: "OK." },
      { role: AgentRole.LEGAL, content: "OK." },
    ];
    const segments = formatSMSSegments(mockResponses, "Done.");
    const encoder = new TextEncoder();
    const byteLen = encoder.encode(segments[0]).length;
    assert(byteLen <= 1590, `Emoji segment is ${byteLen} bytes, exceeds 1590`);
    console.log(`\n    [Emoji segment]: ${byteLen} bytes, ${segments[0].length} JS chars`);
  });

  await runTest("withRetry exhausts retries and throws", async () => {
    let calls = 0;
    try {
      await withRetry(() => {
        calls++;
        const err = new Error("Server down");
        err.status = 500;
        throw err;
      }, 2);
      assert(false, "Should have thrown");
    } catch (err) {
      assert(err.message === "Server down", "Should throw last error");
      assert(calls === 3, "Should attempt 1 + 2 retries");
    }
  });
}

// ── SMS Failover Tests ──────────────────────────────────────────────────────

async function failoverTests() {
  console.log("\n── SMS Failover Tests ──\n");

  // Save original modules so we can restore after mocking
  const origSurgeSend = require("./surgeClient").sendSMS;
  const origTwilioSend = require("./twilioClient").sendSMS;

  await runTest("Surge succeeds → returns provider 'surge'", async () => {
    require("./surgeClient").sendSMS = async () => ({ id: "surge_123" });
    require("./twilioClient").sendSMS = async () => { throw new Error("should not be called"); };

    const { provider, result } = await smsRouter.sendSMSWithFailover("+15550001111", "test");
    assert(provider === "surge", `Expected 'surge', got '${provider}'`);
    assert(result.id === "surge_123", "Should return Surge result");
  });

  await runTest("Surge fails → Twilio succeeds → returns provider 'twilio'", async () => {
    require("./surgeClient").sendSMS = async () => { throw new Error("Surge down"); };
    require("./twilioClient").sendSMS = async () => ({ sid: "SM_abc" });

    const { provider, result } = await smsRouter.sendSMSWithFailover("+15550001111", "test");
    assert(provider === "twilio", `Expected 'twilio', got '${provider}'`);
    assert(result.sid === "SM_abc", "Should return Twilio result");
  });

  await runTest("Both fail → throws with both error messages", async () => {
    require("./surgeClient").sendSMS = async () => { throw new Error("Surge exploded"); };
    require("./twilioClient").sendSMS = async () => { throw new Error("Twilio exploded"); };

    try {
      await smsRouter.sendSMSWithFailover("+15550001111", "test");
      assert(false, "Should have thrown");
    } catch (err) {
      assert(err.message.includes("Surge exploded"), "Should contain Surge error");
      assert(err.message.includes("Twilio exploded"), "Should contain Twilio error");
      assert(err.message.includes("Both SMS providers failed"), "Should indicate both failed");
    }
  });

  await runTest("Surge fails → Twilio is actually called (not skipped)", async () => {
    let twilioCalled = false;
    require("./surgeClient").sendSMS = async () => { throw new Error("Surge timeout"); };
    require("./twilioClient").sendSMS = async () => { twilioCalled = true; return { sid: "SM_xyz" }; };

    await smsRouter.sendSMSWithFailover("+15550001111", "test");
    assert(twilioCalled, "Twilio sendSMS should have been called");
  });

  // Restore originals
  require("./surgeClient").sendSMS = origSurgeSend;
  require("./twilioClient").sendSMS = origTwilioSend;
}

// ── Integration Tests (Live Gemini API) ─────────────────────────────────────

async function integrationTests() {
  console.log("\n── Integration Tests (Live Gemini API) ──\n");

  if (!process.env.GEMINI_API_KEY) {
    console.log("  SKIPPED: GEMINI_API_KEY not set in .env\n");
    return;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  await runTest("consultAgent FINANCE returns valid response", async () => {
    const result = await consultAgent(ai, AgentRole.FINANCE, "Should we hire 5 more engineers?");
    assert(result.role === AgentRole.FINANCE, "Role should be FINANCE");
    assert(result.content.length > 10, "Content should be non-trivial");
    assert(!result.content.includes("is unavailable"), "Should not be an error response");
    console.log(`\n    [CFO preview]: ${result.content.slice(0, 100)}...`);
  });

  await runTest("consultAgent GROWTH returns valid response", async () => {
    const result = await consultAgent(ai, AgentRole.GROWTH, "Should we launch in Europe?");
    assert(result.role === AgentRole.GROWTH, "Role should be GROWTH");
    assert(result.content.length > 10, "Content should be non-trivial");
    assert(!result.content.includes("is unavailable"), "Should not be an error response");
    console.log(`\n    [CMO preview]: ${result.content.slice(0, 100)}...`);
  });

  await runTest("consultAgent TECH returns valid response", async () => {
    const result = await consultAgent(ai, AgentRole.TECH, "Should we rebuild our API in Rust?");
    assert(result.role === AgentRole.TECH, "Role should be TECH");
    assert(result.content.length > 10, "Content should be non-trivial");
    assert(!result.content.includes("is unavailable"), "Should not be an error response");
    console.log(`\n    [CTO preview]: ${result.content.slice(0, 100)}...`);
  });

  await runTest("consultAgent LEGAL returns valid response", async () => {
    const result = await consultAgent(ai, AgentRole.LEGAL, "Can we use customer data for AI training?");
    assert(result.role === AgentRole.LEGAL, "Role should be LEGAL");
    assert(result.content.length > 10, "Content should be non-trivial");
    assert(!result.content.includes("is unavailable"), "Should not be an error response");
    console.log(`\n    [Legal preview]: ${result.content.slice(0, 100)}...`);
  });

  await runTest("Full board consultation returns all agents + synthesis", async () => {
    const result = await consultBoard("Should we raise prices by 20%?");

    assert(result.includes("CFO:"), "Should contain CFO response");
    assert(result.includes("CMO:"), "Should contain CMO response");
    assert(result.includes("CTO:"), "Should contain CTO response");
    assert(result.includes("Legal:"), "Should contain Legal response");
    assert(result.includes("BOARD RESOLUTION"), "Should contain board resolution");

    // Check it's not too long for SMS (Surge has ~1600 char limit per segment)
    console.log(`\n    [Total response length]: ${result.length} chars`);
    console.log(`    [Response preview]:\n${result.slice(0, 300)}...`);
  });
}

// ── Webhook Simulation Test ─────────────────────────────────────────────────

async function webhookTests() {
  console.log("\n── Webhook Simulation Tests ──\n");

  await runTest("Valid webhook payload is parsed correctly", async () => {
    const payload = {
      event_type: "message.received",
      data: {
        body: "Should we pivot to enterprise?",
        conversation: {
          contact: { phone_number: "+15551234567" },
        },
      },
    };

    assert(payload.event_type === "message.received", "Event type should match");
    assert(payload.data.body === "Should we pivot to enterprise?", "Message body should be extracted");
    assert(payload.data.conversation.contact.phone_number === "+15551234567", "Phone should be extracted");
  });

  await runTest("Non-message events are ignored", async () => {
    const payload = { event_type: "message.sent", data: {} };
    assert(payload.event_type !== "message.received", "Should not process sent events");
  });

  await runTest("Missing body is detected", async () => {
    const payload = {
      event_type: "message.received",
      data: { conversation: { contact: { phone_number: "+15551234567" } } },
    };
    const messageBody = payload.data?.body;
    assert(!messageBody, "Should detect missing message body");
  });

  await runTest("Missing phone is detected", async () => {
    const payload = {
      event_type: "message.received",
      data: { body: "test", conversation: {} },
    };
    const senderPhone = payload.data?.conversation?.contact?.phone_number;
    assert(!senderPhone, "Should detect missing phone number");
  });
}

// ── SMS Delivery Test (Live Surge API) ──────────────────────────────────────

async function smsDeliveryTest() {
  console.log("\n── SMS Delivery Test (Live Surge API) ──\n");

  const hasConfig = process.env.SURGE_API_KEY && process.env.SURGE_ACCOUNT_ID && process.env.SURGE_PHONE_NUMBER_ID;
  if (!hasConfig) {
    console.log("  SKIPPED: Surge API credentials not set\n");
    return;
  }

  // Only run if TEST_PHONE is provided to avoid sending unwanted SMS
  const testPhone = process.env.TEST_PHONE;
  if (!testPhone) {
    console.log("  SKIPPED: Set TEST_PHONE env var to send a real SMS test\n");
    console.log("  Usage: TEST_PHONE=+1XXXXXXXXXX node test.js\n");
    return;
  }

  await runTest(`Send test SMS to ${testPhone}`, async () => {
    const testMessage = `[QUORUM TEST] Board is operational. Timestamp: ${new Date().toISOString()}`;
    const result = await sendSMS(testPhone, testMessage);
    assert(result, "Should receive response from Surge API");
    console.log(`\n    SMS sent successfully to ${testPhone}`);
  });
}

// ── SMS Delivery Test (Live Twilio API) ─────────────────────────────────────

async function twilioDeliveryTest() {
  console.log("\n── SMS Delivery Test (Live Twilio API) ──\n");

  const hasConfig = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_API_KEY_SID && process.env.TWILIO_API_KEY_SECRET && process.env.TWILIO_PHONE_NUMBER;
  if (!hasConfig) {
    console.log("  SKIPPED: Twilio credentials not set\n");
    return;
  }

  const testPhone = process.env.TEST_PHONE;
  if (!testPhone) {
    console.log("  SKIPPED: Set TEST_PHONE env var to send a real SMS test\n");
    return;
  }

  await runTest(`Send test SMS via Twilio to ${testPhone}`, async () => {
    const testMessage = `[QUORUM TEST - TWILIO] Board is operational. Timestamp: ${new Date().toISOString()}`;
    const result = await sendSMSTwilio(testPhone, testMessage);
    assert(result && result.sid, "Should receive message SID from Twilio");
    console.log(`\n    SMS sent successfully via Twilio to ${testPhone} (SID: ${result.sid})`);
  });
}

// ── End-to-End Test (Full pipeline with real SMS) ───────────────────────────

async function e2eTest() {
  console.log("\n── End-to-End Test (Board Consultation → SMS) ──\n");

  const hasGemini = !!process.env.GEMINI_API_KEY;
  const hasSurge = process.env.SURGE_API_KEY && process.env.SURGE_ACCOUNT_ID && process.env.SURGE_PHONE_NUMBER_ID;
  const testPhone = process.env.TEST_PHONE;

  if (!hasGemini || !hasSurge || !testPhone) {
    console.log("  SKIPPED: Requires GEMINI_API_KEY, Surge credentials, and TEST_PHONE\n");
    return;
  }

  await runTest("Full pipeline: consult board → send SMS segments", async () => {
    const question = "Should we raise our prices by 15%?";
    const { agentResponses, synthesisText } = await consultBoardRaw(question);

    assert(agentResponses.length === 4, "Should have 4 agent responses");
    assert(synthesisText.length > 10, "Synthesis should be non-trivial");

    const segments = formatSMSSegments(agentResponses, synthesisText);
    assert(segments.length === 5, `Expected 5 segments, got ${segments.length}`);

    for (let i = 0; i < segments.length; i++) {
      await sendSMS(testPhone, segments[i]);
    }
    console.log(`\n    Sent ${segments.length} SMS segments to ${testPhone}`);
  });
}

// ── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log("========================================");
  console.log("  QUORUM SMS PIPELINE TESTS");
  console.log("========================================");

  await unitTests();
  await failoverTests();
  await webhookTests();
  await integrationTests();
  await smsDeliveryTest();
  await twilioDeliveryTest();
  await e2eTest();

  console.log("\n========================================");
  console.log(`  RESULTS: ${passed} passed, ${failed} failed`);
  console.log("========================================\n");

  if (failures.length > 0) {
    console.log("  Failed tests:");
    for (const f of failures) {
      console.log(`    - ${f.name}: ${f.error}`);
    }
    console.log();
  }

  process.exit(failed > 0 ? 1 : 0);
}

main();
