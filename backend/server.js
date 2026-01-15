// MUST be the very first thing
import dotenv from 'dotenv';
dotenv.config();

// Now import everything else
import express from 'express';
import cors from 'cors';
import { createServer } from 'http';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import aiProfileAnalysisRoutes from './routes/ai-profile-analysis.js';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Middleware MUST come after app initialization
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session middleware for passport
app.use(session({
  secret: process.env.JWT_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Configure Passport LinkedIn Strategy with extended scopes
if (process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET) {
  
  const customLinkedInStrategy = new LinkedInStrategy({
      clientID: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
      callbackURL: process.env.LINKEDIN_CALLBACK_URL || 'http://localhost:3001/api/auth/linkedin/callback',
      // Request comprehensive permissions
      scope: [
        'openid',
        'profile', 
        'email',
        'w_member_social' // For reading posts/shares
      ],
      state: true
    },
    function(accessToken, refreshToken, params, profile, done) {
      console.log('🔑 LinkedIn Strategy - Access Token received');
      console.log('📦 Params object:', params);
      
      const minimalProfile = {
        provider: 'linkedin',
        accessToken: accessToken,
        refreshToken: refreshToken,
        params: params
      };
      
      return done(null, minimalProfile);
    }
  );

  // Override the userProfile method to prevent automatic profile fetching
  customLinkedInStrategy.userProfile = function(accessToken, done) {
    console.log('⏭️  Skipping automatic profile fetch');
    done(null, { provider: 'linkedin' });
  };

  passport.use(customLinkedInStrategy);

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  console.log('✅ LinkedIn OAuth configured successfully (Extended Permissions)');
  console.log('   Callback URL:', process.env.LINKEDIN_CALLBACK_URL);
} else {
  console.warn('⚠️  LinkedIn OAuth credentials missing');
}

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  dbName: 'skillsphere'
})
  .then(() => console.log('✅ MongoDB Connected'))
  .catch((err) => console.error('❌ MongoDB Error:', err.message));

// Import routes after dotenv
import interviewRoutes from './routes/interview.js';
import retellRoutes from './routes/retell.js';
import aiAnalysisRoutes from './routes/ai-analysis.js';
import authRoutes from './routes/auth.js';
import onboardingRoutes from './routes/onboarding.js';

// Debug env vars
console.log('🔑 Environment Variables:');
console.log('   PORT:', process.env.PORT);
console.log('   FRONTEND_URL:', process.env.FRONTEND_URL);
console.log('   RETELL_API_KEY:', process.env.RETELL_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   RETELL_AGENT_ID:', process.env.RETELL_AGENT_ID ? '✅ Set' : '❌ Missing');
console.log('   GROQ_API_KEY:', process.env.GROQ_API_KEY ? '✅ Set' : '❌ Missing');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Set' : '❌ Missing');
console.log('   LINKEDIN_CLIENT_ID:', process.env.LINKEDIN_CLIENT_ID ? '✅ Set' : '❌ Missing');
console.log('   LINKEDIN_CLIENT_SECRET:', process.env.LINKEDIN_CLIENT_SECRET ? '✅ Set' : '❌ Missing');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/retell', retellRoutes);
app.use('/api/ai', aiAnalysisRoutes);
app.use('/api/onboarding', onboardingRoutes);
app.use('/api/profile', aiProfileAnalysisRoutes);

// Socket.io
io.on('connection', (socket) => {
  console.log('✅ User connected:', socket.id);

  socket.on('join-room', ({ roomId, role }) => {
    socket.join(roomId);
    console.log(`👤 ${role} joined room: ${roomId}`);
  });

  socket.on('code-change', ({ roomId, code, language }) => {
    socket.to(roomId).emit('code-update', { code, language });
  });

  socket.on('disconnect', () => {
    console.log('❌ User disconnected:', socket.id);
  });
});

app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    retell: !!process.env.RETELL_API_KEY,
    groq: !!process.env.GROQ_API_KEY,
    jwt: !!process.env.JWT_SECRET,
    linkedin: !!process.env.LINKEDIN_CLIENT_ID,
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 Socket.io ready`);
});