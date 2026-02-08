const SURGE_BASE_URL = "https://api.surge.app";

/**
 * Send an SMS via the Surge API.
 * @param {string} to - Recipient phone number (E.164 format)
 * @param {string} body - Message text
 */
async function sendSMS(to, body) {
  const accountId = process.env.SURGE_ACCOUNT_ID;
  const apiKey = process.env.SURGE_API_KEY;
  const phoneNumberId = process.env.SURGE_PHONE_NUMBER_ID;

  const response = await fetch(`${SURGE_BASE_URL}/accounts/${accountId}/messages`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      body: body,
      conversation: {
        contact: { phone_number: to },
        phone_number_id: phoneNumberId,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Surge API error ${response.status}: ${errorText}`);
  }

  return response.json();
}

module.exports = { sendSMS };
