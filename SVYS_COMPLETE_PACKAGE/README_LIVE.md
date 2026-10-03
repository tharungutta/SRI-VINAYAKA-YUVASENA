# SRI VINAYAKA YUVA SENA — LIVE SHARED VERSION

This version uses **Google Sheets as the live database** and **Google Drive for payment screenshots**. GitHub/Netlify only hosts the frontend; they do not store mutable contribution data.

## What happens when Admin saves a contribution
1. Admin enters member, month, amount, date and mandatory screenshot.
2. `index.html` sends the data to the Apps Script Web App.
3. Apps Script writes the contribution into the `Payments` tab of the Google Sheet.
4. The screenshot is stored in Google Drive under:
   `SRI VINAYAKA YUVA SENA / 2026-2027 / Month / Member / screenshot`
5. Apps Script returns the latest Members + Payments data.
6. Every visitor opening the Netlify URL calls the Apps Script GET endpoint and sees the same live data.

## Setup once
1. Create a Google Sheet in `tharungutta123@gmail.com`.
2. Open **Extensions → Apps Script**.
3. Replace the default script with `apps-script.gs`.
4. In Apps Script **Project Settings → Script Properties**, optionally set:
   - `ADMIN_USERNAME` = `Tharun`
   - `ADMIN_PASSWORD` = `Tharun@18`
5. Run `setupSheets()` once and authorize it.
6. Deploy → New deployment → Web app.
   - Execute as: **Me**
   - Who has access: **Anyone**
7. Copy the `/exec` URL into `config.js`.
8. Upload the complete folder to GitHub and connect it to Netlify.

## Important
A normal `.xlsx` file committed to GitHub cannot be updated by a Netlify webpage and then shared live. The live writable source must be Google Sheets (or another backend). The Google Sheet can be downloaded as Excel whenever needed.

No Google Form is required in this version.
