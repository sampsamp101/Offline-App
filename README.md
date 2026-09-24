# Offline-App

This is an project-based learning app built for the sole purpose of automating chat application.


# Offline App: Vercel + Resend demo

1. Create a Resend account and API key. For testing with `onboarding@resend.dev`, use your Resend account's own email address as the recipient.
2. Push this project to your GitHub repository. Do NOT commit any API key or `.env` file.
3. In Vercel, Add New > Project > Import your GitHub repo. Set Framework Preset to **Other** and Root Directory to `./`; deploy.
4. In Vercel Project > Settings > Environment Variables, add `RESEND_API_KEY` (your Resend API key) and `RESEND_TEST_EMAIL` (the email address on your Resend account). Apply to Production and redeploy from Deployments.
5. Open the Vercel URL, visit `/Create_account/Create_account.html`, and create a DEMO account using invented credentials (not a real password). The demo email goes to `RESEND_TEST_EMAIL`, NOT the address typed in the form.
6. Inspect the browser Network tab for POST `/api/send-email`; inspect Vercel function logs if it fails. Opening the HTML locally or via Live Server will not run the Vercel endpoint.
7. For local full-stack testing, use Vercel CLI (`npm install -g vercel`, `vercel login`, `vercel link`, `vercel env pull .env.local`, `vercel dev`), then visit the local URL shown by the CLI.

IMPORTANT: This is a teaching demo, NOT real email verification. The app's existing login stores plaintext passwords in localStorage and is NOT safe for real accounts. The demo endpoint is unauthenticated and lacks persistent rate limiting; do not leave it publicly accessible or use it in production without adding authentication and abuse controls. For sending to arbitrary addresses, verify your sending domain with Resend and add appropriate server-side validation, rate limiting and abuse protections. The API key must never be put in frontend JS or VITE_* variables.

