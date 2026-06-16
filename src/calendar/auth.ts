import { google } from "googleapis";
import fs from "fs";
import path from "path";
import readline from "readline";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CREDENTIALS_PATH = path.resolve(__dirname, "../../google-credentials.json");
const TOKENS_PATH = path.resolve(__dirname, "../../.calendar-tokens.json");
const SCOPES = ["https://www.googleapis.com/auth/calendar.events"];

export function isCalendarConfigured(): boolean {
  return fs.existsSync(CREDENTIALS_PATH);
}

export async function getCalendarClient() {
  if (!fs.existsSync(CREDENTIALS_PATH)) {
    throw new Error(
      "Google Calendar is not set up. See SETUP_CALENDAR.md for instructions."
    );
  }

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const { client_id, client_secret, redirect_uris } =
    credentials.installed ?? credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id,
    client_secret,
    redirect_uris[0]
  );

  if (fs.existsSync(TOKENS_PATH)) {
    const tokens = JSON.parse(fs.readFileSync(TOKENS_PATH, "utf-8"));
    oAuth2Client.setCredentials(tokens);

    oAuth2Client.on("tokens", (newTokens) => {
      const existing = JSON.parse(fs.readFileSync(TOKENS_PATH, "utf-8"));
      fs.writeFileSync(TOKENS_PATH, JSON.stringify({ ...existing, ...newTokens }));
    });

    return google.calendar({ version: "v3", auth: oAuth2Client });
  }

  // First-time auth flow
  const authUrl = oAuth2Client.generateAuthUrl({ access_type: "offline", scope: SCOPES });
  console.log("\nAuthorise Fitero to access Google Calendar:");
  console.log(authUrl);

  const code = await new Promise<string>((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    rl.question("\nPaste the code from that page here: ", (answer) => {
      rl.close();
      resolve(answer.trim());
    });
  });

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  fs.writeFileSync(TOKENS_PATH, JSON.stringify(tokens));
  console.log("Calendar authorised and tokens saved.\n");

  return google.calendar({ version: "v3", auth: oAuth2Client });
}
