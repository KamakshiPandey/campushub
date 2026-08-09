const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const socketHandler = require('./socket/socketHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const listingRoutes = require('./routes/listingRoutes');
const roommateRoutes = require('./routes/roommateRoutes');
const chatRoutes = require('./routes/chatRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const server = http.createServer(app);

// Socket.io initialization
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

socketHandler(io);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: true, credentials: true }));

// Security Headers
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use('/api', limiter);

// Serve static uploads
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')));

// Root test route
app.get('/', (req, res) => {
  res.json({
    message: '🎓 CampusHub API Server is live & running!',
    status: 'Healthy',
    docs: '/api/...',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/roommates', roommateRoutes);
app.use('/api/chats', chatRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/analytics', analyticsRoutes);

// Error Middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// Connect Database & Start Server
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);

    // Expiry check job running every 1 minute
    const { Listing } = require('./models');
    const { Op } = require('sequelize');

    setInterval(async () => {
      try {
        const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);
        const [updatedCount] = await Listing.update(
          { status: 'available', reservedBy: null, reservedAt: null },
          {
            where: {
              status: 'reserved',
              reservedAt: {
                [Op.lt]: fifteenMinutesAgo,
              },
            },
          }
        );
        if (updatedCount > 0) {
          console.log(`⏱️ Auto-release: Reverted ${updatedCount} expired reservations to 'available'`);
        }
      } catch (err) {
        console.error('Reservation expiry cron error:', err);
      }
    }, 60000);
  });
});
