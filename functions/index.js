const { onRequest } = require("firebase-functions/v2/https");
const { logger } = require("firebase-functions");
const { consultBoardRaw, formatSMSSegments } = require("./boardService");
const { sendSMSWithFailover } = require("./smsRouter");

exports.surgeWebhook = onRequest({ timeoutSeconds: 300 }, async (req, res) => {
  // Only accept POST
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
    return;
  }

  // Verify webhook secret
  const webhookSecret = process.env.WEBHOOK_SECRET;
  const providedSecret = req.query.secret || req.headers["x-webhook-secret"];
  if (!webhookSecret || providedSecret !== webhookSecret) {
    logger.warn("Unauthorized webhook attempt", {
      ip: req.ip,
      hasSecret: !!providedSecret,
    });
    res.status(401).send("Unauthorized");
    return;
  }

  try {
    const event = req.body;
    logger.info("Surge webhook received", { event });

    // Surge sends event_type at the top level
    if (event.event_type !== "message.received") {
      res.status(200).send("Ignored event type");
      return;
    }

    const messageBody = event.data?.body;
    const senderPhone = event.data?.conversation?.contact?.phone_number;

    if (!messageBody || !senderPhone) {
      logger.warn("Missing message body or sender phone", { event });
      res.status(400).send("Missing message body or sender phone number");
      return;
    }

    logger.info(`Incoming SMS from ${senderPhone}: ${messageBody}`);

    // Consult the board (4 agents + synthesis)
    const { agentResponses, synthesisText } = await consultBoardRaw(messageBody);

    // Split into SMS segments (each ≤1600 chars for Surge API limit)
    const segments = formatSMSSegments(agentResponses, synthesisText);

    // Send each segment sequentially, continue even if one fails
    for (let i = 0; i < segments.length; i++) {
      try {
        const { provider } = await sendSMSWithFailover(senderPhone, segments[i]);
        logger.info(`Segment ${i + 1} sent via ${provider}`);
      } catch (segErr) {
        logger.error(`Failed to send segment ${i + 1}/${segments.length}`, segErr);
      }
    }

    logger.info(`Reply sent to ${senderPhone} (${segments.length} messages)`);
    res.status(200).send("OK");
  } catch (error) {
    logger.error("Error handling webhook", error);
    res.status(500).send("Internal Server Error");
  }
});
