require('dotenv').config();
const express = require("express");
const { google } = require("googleapis");

const app = express();
const port = 8080;
const id = process.env.SHEET_ID

app.use(express.json());

app.listen(port, () => console.log(`Listening on port ${port}`));

async function authSheets() {
    const auth = new google.auth.GoogleAuth({
        keyFile: "stonks-api.json",
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const authClient = await auth.getClient();

    const sheets = google.sheets({ version: "v4", auth: authClient });

    return {
        auth,
        authClient,
        sheets,
    };
}

app.get("/", async (req, res) => {
    const { sheets } = await authSheets();

    const getRows = await sheets.spreadsheets.values.get({
        spreadsheetId: id,
        range: "Overview",
    });

    res.send(getRows.data);
});