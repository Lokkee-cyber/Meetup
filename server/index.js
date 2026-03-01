import express from 'express';
import nodemailer from 'nodemailer';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_SERVICE = process.env.SMTP_SERVICE || 'gmail';
const SMTP_FROM = process.env.SMTP_FROM || SMTP_USER;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || SMTP_USER;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Email configuration - Using Gmail SMTP
// Note: For production, use App Password or a service like SendGrid/AWS SES
const createTransporter = (allowInvalidTlsOverride = null) => {
  const isProduction = process.env.NODE_ENV === 'production';
  const allowInvalidTls = allowInvalidTlsOverride ?? (process.env.SMTP_ALLOW_INVALID_TLS === 'true' || !isProduction);

  return nodemailer.createTransport({
    service: SMTP_SERVICE,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS
    },
    tls: {
      // In local/dev environments, some networks inject custom TLS certs.
      rejectUnauthorized: !allowInvalidTls
    }
  });
};

// API Routes
app.post('/api/send-order', upload.single('screenshot'), async (req, res) => {
  try {
    if (!SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
      return res.status(500).json({
        success: false,
        message: 'Server email is not configured. Please set SMTP_USER, SMTP_PASS, and ADMIN_EMAIL.'
      });
    }

    const { 
      customerName, 
      customerEmail, 
      customerPhone, 
      companionName, 
      duration, 
      amount, 
      paymentMethod,
      date,
      notes
    } = req.body;

    // Validate required fields
    if (!customerName || !companionName || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required order details' 
      });
    }

    // Create email transporter
    const transporter = createTransporter();

    // Build email content
    const emailContent = `
      New Booking Order Received
      ==========================
      
      CUSTOMER DETAILS:
      - Name: ${customerName}
      - Email: ${customerEmail || 'Not provided'}
      - Phone: ${customerPhone || 'Not provided'}
      
      BOOKING DETAILS:
      - Companion: ${companionName}
      - Duration: ${duration || 'Not specified'}
      - Amount: $${amount}
      - Payment Method: ${paymentMethod || 'Not specified'}
      - Preferred Date: ${date || 'Flexible'}
      - Notes: ${notes || 'None'}
      
      ==========================
      Order received at: ${new Date().toLocaleString()}
    `;

    // Prepare email attachments
    const attachments = [];
    
    // Add screenshot if provided
    if (req.file) {
      const fileExtension = req.file.mimetype?.split('/')[1] || 'jpg';
      attachments.push({
        filename: `payment-screenshot-${Date.now()}.${fileExtension}`,
        content: req.file.buffer,
        contentType: req.file.mimetype
      });
    }

    // Send email
    let info;
    try {
      info = await transporter.sendMail({
        from: `"Meetup Booking System" <${SMTP_FROM}>`,
        to: ADMIN_EMAIL,
        subject: `New Booking - ${companionName} - $${amount} - ${customerName}`,
        text: emailContent,
        attachments: attachments
      });
    } catch (mailError) {
      const isTlsCertError =
        mailError?.code === 'ESOCKET' &&
        String(mailError?.message || '').includes('self-signed certificate');

      if (!isTlsCertError) {
        throw mailError;
      }

      const fallbackTransporter = createTransporter(true);
      info = await fallbackTransporter.sendMail({
        from: `"Meetup Booking System" <${SMTP_FROM}>`,
        to: ADMIN_EMAIL,
        subject: `New Booking - ${companionName} - $${amount} - ${customerName}`,
        text: emailContent,
        attachments: attachments
      });
    }

    console.log('Email sent successfully:', info.messageId);
    
    res.json({ 
      success: true, 
      message: 'Order submitted successfully! We will contact you soon.',
      messageId: info.messageId
    });

  } catch (error) {
    console.error('Error sending email:', error);

    if (error?.code === 'ESOCKET' && String(error?.message || '').includes('self-signed certificate')) {
      return res.status(502).json({
        success: false,
        message: 'Email delivery failed due to TLS certificate validation.'
      });
    }

    res.status(500).json({ 
      success: false, 
      message: 'Failed to send order. Please try again or contact support.' 
    });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'Screenshot is too large. Maximum file size is 10MB.'
      });
    }
    return res.status(400).json({
      success: false,
      message: err.message || 'Upload failed.'
    });
  }

  console.error('Unhandled server error:', err);
  return res.status(500).json({
    success: false,
    message: 'Server error while processing order.'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/send-order`);
});
