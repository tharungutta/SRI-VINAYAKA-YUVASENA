# SIMPLE SETUP — Google Sheets + Google Drive + Netlify

## 1. Create the Google Sheet
Use a new Google Sheet in `tharungutta123@gmail.com`.
Create two tabs:
- `Members`
- `Payments`

Members headers:
`Member ID | Name | Mobile No`

Payments headers:
`Payment ID | Member ID | Member Name | Month | Amount | Payment Date | Screenshot / Proof | Notes`

Add your members and phone numbers to Members.

## 2. Create the Apps Script Web App
Create a form with these questions, using exactly these titles:
- Member ID
- Member Name
- Month
- Amount
- Payment Date
- Screenshot / Proof (File upload)

Set the form to save responses to your Google Sheet. The file-upload response must be available to the Google account owning the form.

Copy the responder URL and put it in `config.js` as `GOOGLE_FORM_URL`.

## 3. Add Apps Script
Open the Google Sheet -> Extensions -> Apps Script.
Paste `apps-script.gs` from this folder.
Save it.
Run the authorization once using your Google account.

The script creates/uses:
`SRI VINAYAKA YUVA SENA / 2026-2027 / Month / Member`
inside your Google Drive and moves uploaded proof files there.

For the live dashboard endpoint, deploy:
Deploy -> New deployment -> Web app
Execute as: Me
Who has access: Anyone
Copy the `/exec` URL into `config.js` as `APPS_SCRIPT_URL`.

## 4. Form trigger
In Apps Script -> Triggers -> Add Trigger:
Function: `onFormSubmit`
Event source: From spreadsheet
Event type: On form submit
Save and authorize.

## 5. Netlify
Upload this folder to Netlify. There is no backend server to run.

## Important
The frontend cannot directly write to Google Sheets or Drive by itself. Apps Script Web App + Apps Script performs the authorized write. This avoids Google OAuth client IDs and keeps the site safe for public visitors.
