const { EmailClient } = require("@azure/communication-email");

// Your Azure Communication Services connection string
const connectionString = process.env.AZURE_EMAIL_CONNECTIONSTRING;

const client = new EmailClient(connectionString);

async function sendEmail(payload) {
  const emailPayload = {
    senderAddress:
      "DoNotReply@35287aee-9ce7-48f7-8f9b-2d3cdc0c74c6.azurecomm.net",
    ...payload,
  };
  const poller = await client.beginSend(emailPayload);
  const result = await poller.pollUntilDone();
  return result;
}

module.exports = {
  sendEmail,
};
