const surgeClient = require("./surgeClient");
const twilioClient = require("./twilioClient");

/**
 * Send an SMS with automatic failover: tries Surge first, falls back to Twilio.
 * @param {string} to - Recipient phone number (E.164 format)
 * @param {string} body - Message text
 * @returns {{ provider: 'surge' | 'twilio', result: any }}
 */
async function sendSMSWithFailover(to, body) {
  let surgeError;

  try {
    const result = await surgeClient.sendSMS(to, body);
    return { provider: "surge", result };
  } catch (err) {
    surgeError = err;
    console.error(`Surge SMS failed, falling back to Twilio: ${err.message}`);
  }

  try {
    const result = await twilioClient.sendSMS(to, body);
    return { provider: "twilio", result };
  } catch (twilioError) {
    throw new Error(
      `Both SMS providers failed.\n  Surge: ${surgeError.message}\n  Twilio: ${twilioError.message}`
    );
  }
}

module.exports = { sendSMSWithFailover };
