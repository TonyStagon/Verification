# Email Verification Setup

This guide will help you set up and run the email verification system with your SMTP server.

## Step 1: Start the Email Server

Open a **new terminal window** and run:

```bash
npm run email-server
```

You should see output like:

```

```

## Step 2: Run the Vite Dev Server (in current terminal)

Open **another terminal window** and run:

```bash
npm run dev
```

## Step 3: Test the Connection

Open this URL in your browser to test SMTP connectivity:

```
http://localhost:3007/api/verify-smtp
```

You should see: `{"success":true,"message":"SMTP connection is working properly"}`

## Step 4: Using Both Servers Together

Instead of running two terminals, you can run both servers in parallel:

```bash
npm run dev-with-emails
```

## How It Works

1. **Frontend (Vite on port 5173)**

   - User enters email in the contact form
   - App calls `createVerificationRequest()` from verification service
   - Verification record is created in Supabase database

2. **Email Service (Express on port 3007)**
   - After creating verification record, frontend calls email API
   - Email server connects to your SMTP server
   - Sends formatted verification email with the 6-digit code

## SMTP Configuration

## Testing

1. Go to your app at `http://localhost:5173`
2. Enter an email address and click "Send Verification Code"
3. Check the target email inbox for the verification email
4. Enter the 6-digit code to verify

## Troubleshooting

**Error: "Failed to connect to email server"**

- Make sure the email server is running on port 3007
- Check if firewall is blocking connections

**Error: SMTP connection failed**

- Verify SMTP credentials in `.env` file
- Test SMTP settings directly with email client
- Check if mail server allows authentication
