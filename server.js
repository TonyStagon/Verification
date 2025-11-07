import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Vite dev server default port
    credentials: true
}));
app.use(express.json());

// Create email transporter
const transporter = nodemailer.createTransporter({
    host: process.env.VITE_SMTP_HOST,
    port: process.env.VITE_SMTP_PORT || 587,
    secure: false, // Use TLS
    auth: {
        user: process.env.VITE_SMTP_USER,
        pass: process.env.VITE_SMTP_PASS,
    },
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Email API endpoint
app.post('/api/send-verification-email', async(req, res) => {
    try {
        const { to, code } = req.body;

        if (!to || !code) {
            return res.status(400).json({
                success: false,
                error: 'Email and verification code are required'
            });
        }

        // Email content
        const mailOptions = {
            from: `"${process.env.VITE_FROM_NAME}" <${process.env.VITE_FROM_EMAIL}>`,
            to: to,
            subject: 'Your Verification Code - Reslocate',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9fafb; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #1f2937; margin-bottom: 10px;">Verify Your Email</h1>
            <p style="color: #6b7280; font-size: 16px;">Enter this code to complete your verification</p>
          </div>
          
          <div style="background: white; border-radius: 12px; padding: 30px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="font-size: 32px; letter-spacing: 8px; color: #111827; background: #f3f4f6; padding: 20px; border-radius: 8px; display: inline-block;">
              ${code}
            </h2>
          </div>
          
          <div style="margin-top: 30px; text-align: center; color: #6b7280;">
            <p style="font-size: 14px;">This code will expire in 10 minutes.</p>
            <p style="font-size: 12px; margin-top: 20px;">
              If you didn't request this email, please ignore it.
            </p>
          </div>
        </div>
      `
        };

        // Send email
        const result = await transporter.sendMail(mailOptions);

        console.log('Email sent successfully:', {
            to: to,
            messageId: result.messageId
        });

        res.json({
            success: true,
            messageId: result.messageId,
            message: 'Verification email sent successfully'
        });

    } catch (error) {
        console.error('Error sending email:', error);

        res.status(500).json({
            success: false,
            error: `Failed to send email: ${error.message}`
        });
    }
});

// SMTP connection verification endpoint
app.get('/api/verify-smtp', async(req, res) => {
    try {
        const isConnected = await transporter.verify();

        if (isConnected) {
            res.json({
                success: true,
                message: 'SMTP connection is working properly'
            });
        } else {
            res.status(500).json({
                success: false,
                error: 'SMTP connection failed'
            });
        }
    } catch (error) {
        console.error('SMTP verification failed:', error);
        res.status(500).json({
            success: false,
            error: `SMTP verification failed: ${error.message}`
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Email server running on http://localhost:${PORT}`);
    console.log('SMTP Configuration:');
    console.log('- Host:', process.env.VITE_SMTP_HOST);
    console.log('- Port:', process.env.VITE_SMTP_PORT);
    console.log('- User:', process.env.VITE_SMTP_USER);
});