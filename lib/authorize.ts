import { google } from "googleapis";

const authorize = async () => {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        private_key: String(process.env.PRIVATE_KEY),
        client_email: process.env.CLIENT_EMAIL,
      },
      scopes: "https://www.googleapis.com/auth/spreadsheets",
    });

    const sheets = google.sheets({ version: "v4", auth });
    return sheets;
  } catch (e) {
    console.error("Error getting Google Sheets instance:", e);
    return null;
  }
};

export default authorize;
