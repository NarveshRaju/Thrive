import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Groq from 'groq-sdk';

const router = express.Router();

const getGroqClient = () => {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

// Middleware to verify JWT
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Generate comprehensive AI insights from all user data
router.post('/generate-insights', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🤖 Generating comprehensive AI insights for:', user.username);

    // Compile all user data
    const comprehensiveData = {
      // Basic info
      username: user.username,
      email: user.email,
      
      // Onboarding data
      careerStatus: user.careerProfile?.status,
      passion: user.careerProfile?.passion,
      onboardingAnswers: user.careerProfile?.answers,
      
      // Resume data
      resumeSkills: user.resumeData?.skills || [],
      resumeExperience: user.resumeData?.experience || [],
      resumeEducation: user.resumeData?.education || [],
      resumeProjects: user.resumeData?.projects || [],
      resumeSummary: user.resumeData?.summary,
      
      // LinkedIn data
      linkedinConnected: !!user.linkedinData,
      linkedinHeadline: user.linkedinData?.headline,
      linkedinSummary: user.linkedinData?.summary,
      linkedinPositions: user.linkedinData?.positions || [],
      linkedinEducation: user.linkedinData?.education || [],
      linkedinSkills: user.linkedinData?.skills || [],
      linkedinCertifications: user.linkedinData?.certifications || [],
      linkedinLanguages: user.linkedinData?.languages || [],
      linkedinPostsCount: user.linkedinData?.postsCount || 0
    };

    const insightsPrompt = `You are an expert career analyst. Analyze this comprehensive user profile and provide deep, personalized insights.

User Profile:
${JSON.stringify(comprehensiveData, null, 2)}

Generate a comprehensive JSON analysis with this exact structure (valid JSON only, no markdown):
{
  "careerPath": "Primary recommended career path based on their skills and interests",
  "alternativePaths": ["alternative path 1", "alternative path 2"],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "areasForImprovement": ["area 1", "area 2", "area 3"],
  "recommendedSkills": ["skill to learn 1", "skill to learn 2", "skill to learn 3"],
  "careerRecommendations": ["recommendation 1", "recommendation 2", "recommendation 3"],
  "personalityTraits": ["trait 1", "trait 2"],
  "industryFit": ["industry 1", "industry 2", "industry 3"],
  "learningPath": {
    "shortTerm": ["short term goal 1", "short term goal 2", "short term goal 3"],
    "mediumTerm": ["medium term goal 1", "medium term goal 2"],
    "longTerm": ["long term goal 1", "long term goal 2"]
  },
  "jobReadinessScore": 75,
  "interviewTips": ["tip 1", "tip 2", "tip 3"],
  "networkingAdvice": "Specific networking strategy for this user",
  "resumeImprovements": ["improvement 1", "improvement 2", "improvement 3"],
  "nextSteps": ["immediate step 1", "immediate step 2", "immediate step 3"]
}

Be specific, actionable, and encouraging. Base recommendations on their actual data.`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a world-class career counselor with expertise in tech careers, talent development, and career transitions. Provide personalized, actionable insights.' },
        { role: 'user', content: insightsPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 3000
    });

    const responseText = completion.choices[0].message.content.trim();
    console.log('📝 Raw AI response received');
    
    // Extract JSON from response
    let aiInsights;
    try {
      if (responseText.includes('```json')) {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        aiInsights = JSON.parse(jsonMatch ? jsonMatch : responseText);[2]
      } else if (responseText.includes('```')) {
        const jsonMatch = responseText.match(/```\n([\s\S]*?)\n```/);
        aiInsights = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
      } else {
        aiInsights = JSON.parse(responseText);
      }
    } catch (parseError) {
      console.error('❌ Failed to parse AI response:', parseError);
      console.error('Response text:', responseText);
      throw new Error('Failed to parse AI insights');
    }

    // Add metadata
    aiInsights.generatedAt = new Date();
    aiInsights.jobReadinessScore = aiInsights.jobReadinessScore || 50;

    // Save insights to database
    await User.findByIdAndUpdate(req.userId, {
      aiInsights: aiInsights,
      updatedAt: new Date()
    });

    console.log('✅ AI insights generated and saved');
    console.log(`   - Career Path: ${aiInsights.careerPath}`);
    console.log(`   - Readiness Score: ${aiInsights.jobReadinessScore}`);
    console.log(`   - Strengths: ${aiInsights.strengths?.length || 0}`);

    res.json({
      success: true,
      insights: aiInsights
    });

  } catch (error) {
    console.error('❌ Error generating insights:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate insights',
      error: error.message 
    });
  }
});

// Get user's complete profile with all data
router.get('/complete-profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password -linkedinData.accessToken');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const completeProfile = {
      basic: {
        id: user._id,
        username: user.username,
        email: user.email,
        onboardingComplete: user.onboardingComplete
      },
      careerProfile: user.careerProfile || null,
      resumeData: user.resumeData || null,
      linkedinData: user.linkedinData || null,
      aiInsights: user.aiInsights || null,
      timestamps: {
        created: user.createdAt,
        updated: user.updatedAt,
        linkedinConnected: user.linkedinConnectedAt,
        resumeUploaded: user.resumeUploadedAt,
        onboardingCompleted: user.careerProfile?.completedAt,
        insightsGenerated: user.aiInsights?.generatedAt
      },
      dataAvailability: {
        hasResume: !!user.resumeData,
        hasLinkedIn: !!user.linkedinData,
        hasOnboarding: !!user.careerProfile,
        hasInsights: !!user.aiInsights
      }
    };

    console.log('✅ Complete profile fetched for:', user.username);
    console.log('   Data availability:', completeProfile.dataAvailability);

    res.json(completeProfile);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile',
      error: error.message 
    });
  }
});

export default router;
