# SRI VINAYAKA YUVA SENA — Netlify Frontend

This is a frontend-only website. Google Sheets is the live database and Google Drive stores payment screenshots.

## What the website shows
- Total members
- Total amount actually collected
- Yearly minimum expected
- Extra amount collected above the minimum
- Monthly collection cards
- Month-by-month member details
- Member profile with every month's amount
- Phone number, payment count, status and latest payment
- Admin Add Contribution button

## Contribution workflow
1. Admin clicks **Add Contribution**.
2. The configured Google Form opens.
3. Admin selects member, month, amount, date and uploads the WhatsApp screenshot.
4. The Google Form response goes into Google Sheets.
5. Apps Script adds/organizes the payment and moves the uploaded screenshot into Google Drive by year/month/member.
6. The dashboard reads the live Apps Script endpoint and updates when refreshed.

## Configure
Edit `config.js`:
- `APPS_SCRIPT_URL` = deployed Apps Script `/exec` URL
- `GOOGLE_FORM_URL` = Google Form responder URL

Do not put passwords, API keys or private credentials in this frontend.

## Netlify
Drag the folder into Netlify Drop, or connect the folder/repository to Netlify. No Node, Python, FastAPI or Uvicorn is required.
