import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  fullName: String,
  headline: String,
  email: String,
  phone: String,
  linkedin: String,
  github: String,
  locationText: String,
  summary: String,
  skills: String,
  experience: String,
  projects: String,
  education: String,
  jobDescription: String,
  atsScore: {
    score: Number,
    verdict: String,
    keywordMatches: [String],
    missingKeywords: [String],
    suggestions: [String],
    lastCalculated: Date
  },
  conversationHistory: [{
    role: String,
    content: String,
    timestamp: { type: Date, default: Date.now }
  }],
  versions: [{
    generatedAt: Date,
    pdfData: String // base64
  }],
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

export default mongoose.model('Resume', resumeSchema);
