# Google Calendar Setup

To enable the `add_to_calendar` tool, complete these steps once:

## 1. Create a Google Cloud project

1. Go to https://console.cloud.google.com
2. Create a new project (e.g. "Fitero")
3. In **APIs & Services → Library**, search for **Google Calendar API** and enable it

## 2. Create OAuth credentials

1. Go to **APIs & Services → Credentials**
2. Click **Create Credentials → OAuth client ID**
3. Application type: **Desktop app**
4. Name it anything (e.g. "Fitero Desktop")
5. Click **Create**, then **Download JSON**

## 3. Place the credentials file

Rename the downloaded file to `google-credentials.json` and put it in the root of this project (next to `package.json`).

## 4. First run authorisation

The next time you ask Fitero to add workouts to your calendar, it will print an authorisation URL. Visit it, approve access, and paste the code back. Tokens are saved to `.calendar-tokens.json` automatically — you won't need to do this again.

> `.calendar-tokens.json` is in `.gitignore` — it contains your personal tokens and should never be committed.
