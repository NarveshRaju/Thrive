import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  
  // Onboarding Data
  onboardingComplete: {
    type: Boolean,
    default: false
  },
  careerProfile: {
    status: String, // student, graduate, career_switcher
    passion: String,
    answers: Object,
    aiAnalysis: String,
    completedAt: Date
  },
  
  // Resume Data
  resumeData: {
    name: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
    skills: [String],
    experience: [{
      company: String,
      position: String,
      duration: String,
      description: String
    }],
    education: [{
      institution: String,
      degree: String,
      field: String,
      year: String
    }],
    certifications: [String],
    projects: [{
      name: String,
      description: String,
      technologies: [String]
    }]
  },
  resumeRawText: String,
  resumeUploadedAt: Date,
  
  // LinkedIn Data (Comprehensive)
  linkedinData: {
    // Basic Info
    id: String,
    firstName: String,
    lastName: String,
    email: String,
    profilePicture: String,
    headline: String,
    summary: String,
    
    // Work Experience
    positions: [{
      title: String,
      company: String,
      startDate: Object,
      endDate: Object,
      description: String,
      location: String,
      isCurrent: Boolean
    }],
    
    // Education
    education: [{
      school: String,
      degree: String,
      field: String,
      startDate: Object,
      endDate: Object,
      activities: String,
      grade: String
    }],
    
    // Skills
    skills: [String],
    
    // Posts/Activity
    postsCount: Number,
    recentPosts: [{
      text: String,
      created: Date
    }],
    
    // Certifications
    certifications: [{
      name: String,
      authority: String,
      startDate: Object,
      endDate: Object,
      licenseNumber: String
    }],
    
    // Languages
    languages: [{
      name: String,
      proficiency: String
    }],
    
    // Metadata
    accessToken: String,
    fetchedAt: Date
  },
  linkedinConnectedAt: Date,
  
  // AI-Generated Insights
  aiInsights: {
    careerPath: String,
    strengths: [String],
    areasForImprovement: [String],
    recommendedSkills: [String],
    careerRecommendations: [String],
    personalityTraits: [String],
    industryFit: [String],
    generatedAt: Date
  },
  interviewHistory: [{
    interviewId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interview'
    },
    completedAt: Date,
    overallScore: Number,
    interviewType: String,
    duration: Number
  }],

  // Interview Statistics
  interviewStats: {
    totalInterviews: {
      type: Number,
      default: 0
    },
    averageScore: {
      type: Number,
      default: 0
    },
    bestScore: {
      type: Number,
      default: 0
    },
    totalDuration: {
      type: Number,
      default: 0
    },
    lastInterviewDate: Date,
    interviewsByType: {
      technical: { type: Number, default: 0 },
      coding: { type: Number, default: 0 },
      behavioral: { type: Number, default: 0 },
      systemDesign: { type: Number, default: 0 }
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamp on save
userSchema.pre('save', async function(next) {
  this.updatedAt = new Date();
  
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model('User', userSchema);
