import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  candidateName: {
    type: String,
    required: true
  },
  
  // Interview Configuration
  interviewType: {
    type: String,
    enum: ['technical', 'coding', 'behavioral', 'system-design', 'general'],
    default: 'technical'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  
  // Status & Timing
  status: {
    type: String,
    enum: ['scheduled', 'waiting', 'in-progress', 'completed', 'cancelled'],
    default: 'scheduled'
  },
  startTime: Date,
  endTime: Date,
  duration: Number, // in seconds
  
  // Retell Call Data
  retellCallId: String,
  callStartedAt: Date,
  callEndedAt: Date,
  recordingUrl: String,
  
  // Code Tracking
  codeSubmitted: {
    code: {
      type: String,
      default: '// Start coding here...\n\nfunction solution() {\n  // Your code here\n}\n'
    },
    language: {
      type: String,
      default: 'javascript'
    },
    submittedAt: Date
  },
  
  // Real-time Code Analysis History
  codeAnalyses: [{
    code: String,
    analysis: String,
    scores: {
      quality: Number,
      correctness: Number,
      efficiency: Number
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Conversation Transcript
  transcript: [{
    role: {
      type: String,
      enum: ['agent', 'user']
    },
    content: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Speech transcripts (alternative format)
  transcripts: [{
    text: String,
    speaker: String,
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Emotion Tracking (if using face detection)
  emotions: [{
    emotion: {
      type: String,
      enum: ['happy', 'sad', 'angry', 'surprised', 'fear', 'disgust', 'neutral', 'confident', 'nervous']
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Performance Scores
  scores: {
    codeQuality: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    communication: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    problemSolving: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    technicalKnowledge: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    confidence: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    overall: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    }
  },
  
  // Detailed AI Analysis
  aiAnalysis: {
    strengths: [String],
    weaknesses: [String],
    recommendations: [String],
    codeReview: String,
    communicationFeedback: String,
    technicalFeedback: String,
    overallFeedback: String,
    detailedReport: String,
    generatedAt: Date
  },
  
  // Final Report
  finalReport: String,
  
  // Participants
  participants: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['candidate', 'interviewer', 'observer']
    },
    joinedAt: Date
  }],
  
  // Metadata
  completedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { 
  timestamps: true
});

// Indexes for faster queries
interviewSchema.index({ createdAt: -1 });
interviewSchema.index({ status: 1 });
interviewSchema.index({ userId: 1, status: 1 });

// Methods
interviewSchema.methods.calculateAverageConfidence = function() {
  if (this.emotions.length === 0) return 0;
  const sum = this.emotions.reduce((acc, e) => acc + e.confidence, 0);
  return Math.round(sum / this.emotions.length);
};

interviewSchema.methods.calculateDuration = function() {
  if (!this.endTime || !this.startTime) return 0;
  const duration = (this.endTime - this.startTime) / 1000; // seconds
  return Math.round(duration);
};

interviewSchema.methods.getJoinUrl = function() {
  return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/interview/${this.roomId}`;
};

// Pre-save hook to update timestamps
interviewSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  
  // Calculate duration if interview is completed
  if (this.status === 'completed' && !this.duration) {
    this.duration = this.calculateDuration();
  }
  
  // Calculate confidence from emotions
  if (this.emotions.length > 0 && this.scores.confidence === 0) {
    this.scores.confidence = this.calculateAverageConfidence();
  }
  
  next();
});

// Virtual for interview URL
interviewSchema.virtual('joinUrl').get(function() {
  return this.getJoinUrl();
});

// Ensure virtuals are included in JSON
interviewSchema.set('toJSON', { virtuals: true });
interviewSchema.set('toObject', { virtuals: true });

export default mongoose.model('Interview', interviewSchema);
