# Admin access

The public website is view-only. Anyone can see the dashboard, monthly totals and member details.

Only the Add Contribution action is protected by an admin prompt:

- Username: `Tharun`
- Password: `Tharun@18`

After successful login, the site opens the Admin Center. Contributions and new members are sent directly to the Apps Script Web App, which updates the live Google Sheet and Google Drive.

## Important security note
This is a frontend-only password gate. The username/password are present in the browser code, so this should be treated as a convenience gate, not as strong server-side security. The Google Form itself should be configured so that only the administrator can submit it, or the Apps Script should validate the submission source if you need real security.
