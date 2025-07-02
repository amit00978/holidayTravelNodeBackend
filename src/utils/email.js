require('dotenv').config();
const axios = require('axios');
const { getAccessToken } = require('./zohoAuth');

const sendEmail = async (options) => {
  try {
    const token = await getAccessToken();
    const accountId = process.env.ZOHO_ACCOUNT_ID;

    const response = await axios.post(
      `https://mail.zoho.in/api/accounts/${accountId}/messages`,
      {
        fromAddress: process.env.ZOHO_USER,
        toAddress: options.email,
        subject: options.subject,
        content: options.message
      },
      {
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log("✅ Email sent:", response.data);
    return response.data;
  } catch (err) {
    console.error("🚨 Error sending email:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = sendEmail;
