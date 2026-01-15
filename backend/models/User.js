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
    status: String,
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
  
  // LinkedIn Data
  linkedinData: {
    id: String,
    firstName: String,
    lastName: String,
    email: String,
    profilePicture: String,
    headline: String,
    summary: String,
    positions: [{
      title: String,
      company: String,
      startDate: Object,
      endDate: Object,
      description: String,
      location: String,
      isCurrent: Boolean
    }],
    education: [{
      school: String,
      degree: String,
      field: String,
      startDate: Object,
      endDate: Object,
      activities: String,
      grade: String
    }],
    skills: [String],
    postsCount: Number,
    recentPosts: [{
      text: String,
      created: Date
    }],
    certifications: [{
      name: String,
      authority: String,
      startDate: Object,
      endDate: Object,
      licenseNumber: String
    }],
    languages: [{
      name: String,
      proficiency: String
    }],
    accessToken: String,
    fetchedAt: Date
  },
  linkedinConnectedAt: Date,
  
  // AI-Generated Insights (ENHANCED)
  aiInsights: {
    // Career Path Recommendations
    careerPath: String,
    alternativePaths: [String],
    topCareerRecommendation: String,
    
    // Complete Career Paths (Solar System)
    completeCareerPaths: {
      topRecommendation: String,
      personalizedMessage: String,
      careers: [{
        id: Number,
        title: String,
        matchScore: Number,
        planet: String,
        size: Number,
        description: String,
        salary: String,
        growth: String,
        demand: String,
        whyMatch: [String],
        requiredSkills: [String],
        skillsYouHave: [String],
        skillsToLearn: [String],
        industryTrends: [String],
        roadmap: [{
          phase: String,
          duration: String,
          description: String,
          topics: [String]
        }],
        learningResources: [String],
        nextSteps: [String],
        estimatedTimeToJob: String,
        icon: String,
        generatedAt: Date
      }],
      profileType: String,
      generatedAt: Date
    },
    careerPathsGeneratedAt: Date,
    
    // Learning Path (NEW - Persistent)
    learningPath: {
      pathName: String,
      personalizedMessage: String,
      estimatedTotalTime: String,
      skillLevel: String,
      levels: [{
        id: Number,
        name: String,
        subtitle: String,
        planetName: String,
        difficulty: String,
        color: String,
        topics: [String],
        estimatedTime: String,
        badge: String,
        videoId: String,
        description: String,
        project: String,
        assessment: [{
          question: String,
          options: [String],
          correctAnswer: Number,
          tip: String
        }]
      }],
      generatedAt: Date
    },
    learningPathGeneratedAt: Date,
    
    // General Insights
    strengths: [String],
    areasForImprovement: [String],
    recommendedSkills: [String],
    careerRecommendations: [String],
    personalityTraits: [String],
    industryFit: [String],
    jobReadinessScore: Number,
    generatedAt: Date
  },
  
  // Learning Progress Tracking (NEW)
  learningProgress: {
    unlockedLevel: {
      type: Number,
      default: 1
    },
    completedLevels: [{
      type: Number
    }],
    levelScores: [{
      levelId: Number,
      score: Number,
      completedAt: Date,
      attempts: Number,
      mistakes: [{
        question: String,
        userAnswer: Number,
        correctAnswer: Number,
        tip: String
      }]
    }],
    totalTimeSpent: {
      type: Number,
      default: 0 // in minutes
    },
    lastAccessedAt: Date,
    startedAt: Date,
    badges: [{
      name: String,
      earnedAt: Date,
      levelId: Number
    }]
  },
  
  // Interview History
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

// Helper method to unlock next level
userSchema.methods.unlockNextLevel = function(currentLevelId, score) {
  if (!this.learningProgress) {
    this.learningProgress = {
      unlockedLevel: 1,
      completedLevels: [],
      levelScores: [],
      totalTimeSpent: 0
    };
  }

  const passed = score >= 70;
  
  if (passed) {
    // Add to completed if not already there
    if (!this.learningProgress.completedLevels.includes(currentLevelId)) {
      this.learningProgress.completedLevels.push(currentLevelId);
    }
    
    // Unlock next level
    if (currentLevelId === this.learningProgress.unlockedLevel) {
      this.learningProgress.unlockedLevel = currentLevelId + 1;
    }
  }
  
  return passed;
};

// Helper method to get learning stats
userSchema.methods.getLearningStats = function() {
  if (!this.learningProgress || !this.aiInsights?.learningPath) {
    return null;
  }

  const totalLevels = this.aiInsights.learningPath.levels?.length || 0;
  const completedLevels = this.learningProgress.completedLevels.length;
  const progressPercentage = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;
  
  const averageScore = this.learningProgress.levelScores.length > 0
    ? Math.round(
        this.learningProgress.levelScores.reduce((sum, s) => sum + s.score, 0) / 
        this.learningProgress.levelScores.length
      )
    : 0;

  return {
    totalLevels,
    completedLevels,
    progressPercentage,
    averageScore,
    totalTimeSpent: this.learningProgress.totalTimeSpent,
    currentLevel: this.learningProgress.unlockedLevel,
    badgesEarned: this.learningProgress.badges?.length || 0
  };
};

export default mongoose.model('User', userSchema);
