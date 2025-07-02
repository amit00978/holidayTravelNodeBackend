require('dotenv').config();
const axios = require('axios');

let accessToken = null;
let expiresAt = null;

const getAccessToken = async () => {
  const now = Math.floor(Date.now() / 1000);

  if (accessToken && expiresAt && now < expiresAt - 60) {
    return accessToken;
  }

  console.log("🔄 Refreshing Zoho access token...");
  try {
    const response = await axios.post(
      'https://accounts.zoho.in/oauth/v2/token',
      null,
      {
        params: {
          refresh_token: process.env.ZOHO_REFRESH_TOKEN,
          client_id: process.env.ZOHO_CLIENT_ID,
          client_secret: process.env.ZOHO_CLIENT_SECRET,
          grant_type: 'refresh_token'
        }
      }
    );

    accessToken = response.data.access_token;
    expiresAt = now + response.data.expires_in;
    console.log("✅ Got new Zoho access token");

    return accessToken;
  } catch (err) {
    console.error("🚨 Error refreshing Zoho access token:", err.response?.data || err.message);
    throw err;
  }
};

module.exports = { getAccessToken };
