import express from 'express';
import cors from 'cors';
import multer from 'multer';

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || 'https://meetup-two-phi.vercel.app';
const ADDITIONAL_ALLOWED_ORIGINS = (process.env.ADDITIONAL_ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:5174')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const ALLOWED_ORIGINS = [FRONTEND_ORIGIN, ...ADDITIONAL_ALLOWED_ORIGINS];
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const RESEND_FROM = process.env.RESEND_FROM;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser clients (no origin header) and configured origins.
    if (!origin || ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// API Routes
app.post('/api/send-order', upload.single('screenshot'), async (req, res) => {
  try {
    if (!RESEND_API_KEY || !RESEND_FROM || !ADMIN_EMAIL) {
      return res.status(500).json({
        success: false,
        message: 'Server email is not configured. Please set RESEND_API_KEY, RESEND_FROM, and ADMIN_EMAIL.'
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

    const attachments = [];
    
    // Add screenshot if provided
    if (req.file) {
      const fileExtension = req.file.mimetype?.split('/')[1] || 'jpg';
      attachments.push({
        filename: `payment-screenshot-${Date.now()}.${fileExtension}`,
        content: req.file.buffer.toString('base64')
      });
    }

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: RESEND_FROM,
        to: [ADMIN_EMAIL],
        subject: `New Booking - ${companionName} - $${amount} - ${customerName}`,
        text: emailContent,
        attachments
      })
    });

    const emailResult = await emailResponse.json().catch(() => ({}));

    if (!emailResponse.ok) {
      const providerError = emailResult?.message || emailResult?.error || 'Unknown provider error';
      throw new Error(`Resend API error (${emailResponse.status}): ${providerError}`);
    }

    console.log('Email sent successfully:', emailResult?.id);
    
    res.json({ 
      success: true, 
      message: 'Order submitted successfully! We will contact you soon.',
      messageId: emailResult?.id
    });

  } catch (error) {
    console.error('Error sending email:', error);

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
