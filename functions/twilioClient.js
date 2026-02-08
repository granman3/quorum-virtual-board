const twilio = require("twilio");

/**
 * Send an SMS via the Twilio API.
 * @param {string} to - Recipient phone number (E.164 format)
 * @param {string} body - Message text
 */
async function sendSMS(to, body) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const apiKeySid = process.env.TWILIO_API_KEY_SID;
  const apiKeySecret = process.env.TWILIO_API_KEY_SECRET;
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;

  const client = twilio(apiKeySid, apiKeySecret, { accountSid });

  const message = await client.messages.create({
    to,
    from: fromNumber,
    body,
  });

  return message;
}

module.exports = { sendSMS };
