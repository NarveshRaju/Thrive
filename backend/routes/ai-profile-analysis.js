import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

const router = express.Router();

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY not configured');
  }
  return new GoogleGenerativeAI(apiKey);
};

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

// ===== GET COMPLETE PROFILE =====
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
    res.json(completeProfile);
  } catch (error) {
    console.error('❌ Error fetching profile:', error);
    res.status(500).json({ 
      message: 'Failed to fetch profile',
      error: error.message 
    });
  }
});

// ===== GENERATE GENERAL AI INSIGHTS (using Groq) =====
router.post('/generate-insights', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🤖 Generating AI insights for:', user.username);

    const comprehensiveData = {
      username: user.username,
      careerStatus: user.careerProfile?.status,
      passion: user.careerProfile?.passion,
      resumeSkills: user.resumeData?.skills || [],
      resumeExperience: user.resumeData?.experience || [],
      linkedinHeadline: user.linkedinData?.headline,
      linkedinSkills: user.linkedinData?.skills || []
    };

    const insightsPrompt = `Analyze this profile and provide career insights in JSON format:
${JSON.stringify(comprehensiveData, null, 2)}

Return ONLY this JSON structure:
{
  "careerPath": "Primary career recommendation",
  "alternativePaths": ["path1", "path2"],
  "strengths": ["strength1", "strength2", "strength3"],
  "areasForImprovement": ["area1", "area2"],
  "recommendedSkills": ["skill1", "skill2"],
  "jobReadinessScore": 75,
  "nextSteps": ["step1", "step2"]
}`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are a career counselor. Return only valid JSON, no markdown.' },
        { role: 'user', content: insightsPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 2000
    });

    const responseText = completion.choices[0].message.content.trim();
    
    let aiInsights;
    try {
      const jsonText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      aiInsights = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ Parse error:', parseError);
      throw new Error('Failed to parse AI response');
    }

    aiInsights.generatedAt = new Date();

    await User.findByIdAndUpdate(req.userId, {
      aiInsights: aiInsights,
      updatedAt: new Date()
    });

    console.log('✅ AI insights saved');

    res.json({
      success: true,
      insights: aiInsights
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate insights',
      error: error.message 
    });
  }
});

// ===== GENERATE CAREER PATHS (using Gemini 2.0 Flash) =====
router.post('/generate-complete-career-paths', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🎯 Generating career paths with Gemini for:', user.username);

    const userProfile = {
      name: user.username,
      passion: user.careerProfile?.passion || 'professional growth',
      status: user.careerProfile?.status || 'exploring',
      skills: [
        ...(user.resumeData?.skills || []),
        ...(user.linkedinData?.skills || [])
      ].filter((v, i, a) => a.indexOf(v) === i),
      experience: user.resumeData?.experience || user.linkedinData?.positions || [],
      currentRole: user.linkedinData?.headline || user.resumeData?.summary || 'aspiring professional',
      yearsOfExperience: (user.resumeData?.experience?.length || 0) + (user.linkedinData?.positions?.length || 0)
    };

    // Detect category
    const profileText = `${userProfile.passion} ${userProfile.currentRole} ${userProfile.skills.join(' ')}`.toLowerCase();
    
    const careerCategories = {
      'Mobile Development': ['mobile', 'app development', 'react native', 'flutter', 'ios', 'android'],
      'Web Development': ['web', 'react', 'angular', 'vue', 'javascript', 'node', 'frontend', 'backend'],
      'Data & AI': ['data', 'machine learning', 'ai', 'python', 'data science'],
      'Design': ['design', 'ui', 'ux', 'figma', 'creative'],
      'Marketing': ['marketing', 'seo', 'content', 'social media', 'brand']
    };

    let primaryCategory = 'Mixed';
    let maxMatches = 0;

    for (const [category, keywords] of Object.entries(careerCategories)) {
      const matches = keywords.filter(keyword => profileText.includes(keyword)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        primaryCategory = category;
      }
    }

    console.log(`   Category: ${primaryCategory}`);

    const careerPathPrompt = `Analyze this profile and generate 5 careers.

Name: ${userProfile.name}
Passion: "${userProfile.passion}"
Category: ${primaryCategory}
Skills: ${userProfile.skills.slice(0, 15).join(', ') || 'Beginner'}

RULES FOR ${primaryCategory}:
${primaryCategory === 'Mobile Development' ? 'Mobile App Dev (90%), React Native Dev (85%), Android/iOS (78%), UI/UX Mobile (70%), Full Stack Mobile (68%)' :
  primaryCategory === 'Web Development' ? 'Full Stack Dev (90%), Frontend (85%), Backend (78%), DevOps (72%), UI/UX (68%)' :
  primaryCategory === 'Data & AI' ? 'Data Scientist (90%), ML Engineer (85%), AI Engineer (78%), Data Analyst (72%)' :
  'Select 5 relevant careers (70-90% match)'}

Return ONLY JSON:
{
  "topRecommendation": "Career title",
  "personalizedMessage": "Message to ${userProfile.name}",
  "careers": [
    {
      "title": "Career Title",
      "matchScore": 90,
      "planet": "mercury",
      "size": 80,
      "description": "Why this fits",
      "salary": "₹6-18 LPA",
      "growth": "+28%",
      "demand": "Very High",
      "whyMatch": ["Reason 1", "Reason 2"],
      "requiredSkills": ["Skill1", "Skill2"],
      "skillsYouHave": ["User skill"],
      "skillsToLearn": ["Gap1"],
      "industryTrends": ["Trend1"],
      "roadmap": [
        {"phase": "Foundation", "duration": "3-6m", "description": "Basics", "topics": ["Topic1"]}
      ],
      "learningResources": ["Resource1"],
      "nextSteps": ["Action1"],
      "estimatedTimeToJob": "8-12 months"
    }
  ]
}`;

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 16384,
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(careerPathPrompt);
    const responseText = result.response.text();

    let aiCareerPaths = JSON.parse(responseText.trim());

    const iconMap = {
      'Mobile App Developer': 'Code',
      'React Native Developer': 'Code',
      'Full Stack Developer': 'Code',
      'Data Scientist': 'Database',
      'UI/UX Designer': 'Palette',
      'DevOps Engineer': 'Shield',
      'Product Manager': 'Briefcase'
    };

    aiCareerPaths.careers = aiCareerPaths.careers.map((career, index) => ({
      ...career,
      id: index + 1,
      icon: iconMap[career.title] || 'Code',
      generatedAt: new Date()
    }));

    await User.findByIdAndUpdate(req.userId, {
      'aiInsights.completeCareerPaths': aiCareerPaths,
      'aiInsights.topCareerRecommendation': aiCareerPaths.topRecommendation,
      'aiInsights.careerPathsGeneratedAt': new Date(),
      'aiInsights.profileType': primaryCategory,
      updatedAt: new Date()
    });

    console.log('✅ Career paths saved');

    res.json({
      success: true,
      ...aiCareerPaths,
      profileType: primaryCategory
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate career paths',
      error: error.message 
    });
  }
});
// ===== GENERATE DYNAMIC LEARNING PATH (using Gemini) =====
router.post('/generate-learning-path', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if already exists
    if (user.aiInsights?.learningPath?.levels?.length > 0) {
      const existing = user.aiInsights.learningPath;
      const age = new Date() - new Date(existing.generatedAt);
      
      // Only regenerate if > 30 days old OR user requests refresh
      if (age < 30 * 24 * 60 * 60 * 1000 && !req.body.forceRefresh) {
        console.log('✅ Returning cached learning path');
        return res.json({
          success: true,
          cached: true,
          ...existing,
          progress: user.learningProgress
        });
      }
    }

    console.log('🤖 Generating new learning path for:', user.username);

    const userProfile = {
      name: user.username,
      passion: user.careerProfile?.passion || 'technology',
      currentSkills: [
        ...(user.resumeData?.skills || []),
        ...(user.linkedinData?.skills || [])
      ].filter((v, i, a) => a.indexOf(v) === i),
      targetCareer: user.aiInsights?.topCareerRecommendation || 'Full Stack Developer',
      experience: user.resumeData?.experience || []
    };

    const skillLevel = userProfile.currentSkills.length === 0 ? 'Beginner' : 
                       userProfile.currentSkills.length < 5 ? 'Beginner' :
                       userProfile.currentSkills.length < 15 ? 'Intermediate' : 'Advanced';

    const learningPathPrompt = `Create a personalized learning roadmap for ${userProfile.targetCareer}.

USER: ${userProfile.name}
LEVEL: ${skillLevel}
SKILLS: ${userProfile.currentSkills.slice(0, 10).join(', ') || 'Beginner'}
PASSION: ${userProfile.passion}

Create 6-8 progressive levels. Each level = 1 planet in a solar system.

Return ONLY JSON:
{
  "pathName": "Journey to ${userProfile.targetCareer}",
  "personalizedMessage": "Message to ${userProfile.name}",
  "estimatedTotalTime": "8-12 months",
  "levels": [
    {
      "id": 1,
      "name": "LEVEL 0",
      "subtitle": "Foundation Building",
      "planetName": "Mercury",
      "difficulty": "Easy",
      "color": "from-blue-500 to-blue-700",
      "topics": ["HTML Basics", "CSS Fundamentals", "Git Basics"],
      "estimatedTime": "3 weeks",
      "badge": "Web Initiate",
      "videoId": "UB1O30fR-EE",
      "description": "Learn the building blocks of web development",
      "project": "Build a personal portfolio page",
      "assessment": [
        {
          "question": "What does HTML stand for?",
          "options": ["Hyper Text Markup Language", "High Tech Modern Language", "Home Tool Markup Language", "Hyperlinks and Text Markup Language"],
          "correctAnswer": 0,
          "tip": "HTML is Hyper Text Markup Language - the standard markup language for web pages"
        }
      ]
    }
  ]
}

Planet progression: Mercury (blue), Venus (gray), Earth (green), Mars (red), Jupiter (orange), Saturn (purple)
Difficulties: Easy, Easy, Medium, Medium, Hard, Hard, Expert
Include 5 questions per level`;

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.8,
        maxOutputTokens: 16384,
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(learningPathPrompt);
    const learningPath = JSON.parse(result.response.text().trim());

    learningPath.generatedAt = new Date();
    learningPath.skillLevel = skillLevel;

    // Save to database
    await User.findByIdAndUpdate(req.userId, {
      'aiInsights.learningPath': learningPath,
      'aiInsights.learningPathGeneratedAt': new Date(),
      'learningProgress.unlockedLevel': 1,
      'learningProgress.completedLevels': [],
      'learningProgress.levelScores': [],
      updatedAt: new Date()
    });

    console.log('✅ Learning path generated and saved');
    
    res.json({
      success: true,
      cached: false,
      ...learningPath,
      progress: {
        unlockedLevel: 1,
        completedLevels: [],
        levelScores: []
      }
    });

  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate learning path',
      error: error.message 
    });
  }
});

// ===== GET LEARNING PATH =====
router.get('/learning-path', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user.aiInsights?.learningPath) {
      return res.status(404).json({ 
        success: false,
        message: 'No learning path found. Generate one first.' 
      });
    }

    res.json({
      success: true,
      ...user.aiInsights.learningPath,
      progress: user.learningProgress || {
        unlockedLevel: 1,
        completedLevels: [],
        levelScores: []
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== UPDATE PROGRESS =====
router.post('/update-learning-progress', authenticateUser, async (req, res) => {
  try {
    const { levelId, score, mistakes, timeSpent } = req.body;
    
    const user = await User.findById(req.userId);
    const progress = user.learningProgress || { 
      unlockedLevel: 1, 
      completedLevels: [], 
      levelScores: [] 
    };

    const passed = score >= 70;

    // Add/update score
    const existingIdx = progress.levelScores.findIndex(s => s.levelId === levelId);
    const scoreEntry = {
      levelId,
      score,
      completedAt: new Date(),
      mistakes: mistakes || []
    };

    if (existingIdx >= 0) {
      progress.levelScores[existingIdx] = scoreEntry;
    } else {
      progress.levelScores.push(scoreEntry);
    }

    // Mark as completed if passed
    if (passed && !progress.completedLevels.includes(levelId)) {
      progress.completedLevels.push(levelId);
    }

    // Unlock next level
    if (passed && levelId === progress.unlockedLevel) {
      progress.unlockedLevel = levelId + 1;
    }

    // Track time
    progress.totalTimeSpent = (progress.totalTimeSpent || 0) + (timeSpent || 0);
    progress.lastAccessedAt = new Date();

    await User.findByIdAndUpdate(req.userId, {
      learningProgress: progress,
      updatedAt: new Date()
    });

    console.log(`✅ Progress updated: Level ${levelId}, Score ${score}%`);

    res.json({ 
      success: true, 
      progress,
      passed,
      nextUnlocked: passed && levelId === progress.unlockedLevel - 1
    });
  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/generate-resume-from-profile', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🤖 Generating AI resume from user profile...');

    // Gather all user data
    const profileData = {
      username: user.username,
      email: user.email,
      
      // From onboarding
      passion: user.careerProfile?.passion,
      status: user.careerProfile?.status,
      
      // From resume upload
      resumeData: user.resumeData,
      
      // From LinkedIn
      linkedinData: user.linkedinData,
      
      // From AI insights
      topCareer: user.aiInsights?.topCareerRecommendation || user.aiInsights?.careerPath,
      strengths: user.aiInsights?.strengths,
      skills: user.aiInsights?.recommendedSkills,
      
      // From learning progress
      completedLevels: user.learningProgress?.completedLevels?.length || 0,
      badges: user.learningProgress?.badges || [],
      
      // From interviews
      interviewStats: user.interviewStats
    };

    const prompt = `You are an expert resume writer. Generate a professional, ATS-optimized resume using the user's data below.

USER PROFILE:
Name: ${profileData.username}
Email: ${profileData.email}
Career Goal: ${profileData.topCareer || 'Software Developer'}
Passion: ${profileData.passion || 'Technology'}
Status: ${profileData.status || 'Professional'}

EXISTING RESUME DATA:
${JSON.stringify(profileData.resumeData, null, 2)}

LINKEDIN DATA:
${JSON.stringify(profileData.linkedinData, null, 2)}

AI INSIGHTS:
- Strengths: ${profileData.strengths?.join(', ') || 'None'}
- Recommended Skills: ${profileData.skills?.join(', ') || 'None'}

LEARNING ACHIEVEMENTS:
- Completed ${profileData.completedLevels} learning missions
- Badges earned: ${profileData.badges.map(b => b.name).join(', ') || 'None'}

INTERVIEW PERFORMANCE:
- Total interviews: ${profileData.interviewStats?.totalInterviews || 0}
- Average score: ${profileData.interviewStats?.averageScore || 0}%

Generate a complete, professional resume with:

1. **Full Name** - Use real name from LinkedIn or username
2. **Professional Headline** - Compelling one-liner (e.g., "Full Stack Developer | React & Node.js Expert")
3. **Contact Info** - Email, phone (generate realistic), LinkedIn URL, GitHub URL
4. **Location** - City, State/Country
5. **Professional Summary** - 3-4 sentences highlighting experience, skills, passion, and career goals
6. **Skills** - Comma-separated list of 15-20 technical skills (prioritize those from LinkedIn + AI insights)
7. **Work Experience** - If available from LinkedIn/resume, enhance it. If not, create 2-3 realistic projects as "Freelance/Personal Projects"
   Format: "• Position at Company (Year-Year)\n• Achievement with metrics\n• Achievement with metrics"
8. **Projects** - 3-4 impressive projects based on their skills/passion
   Format: "• Project Name - Description\n• Tech stack: X, Y, Z\n• Impact: Quantified result"
9. **Education** - From LinkedIn or create relevant degree for their career goal
   Format: "• Degree, Institution (Year-Year)\n• GPA/Honors if applicable"

IMPORTANT RULES:
- Use bullet points (•) for lists
- Include QUANTIFIED metrics (numbers, percentages, scale)
- Make it ATS-friendly (no tables, simple formatting)
- Sound professional but authentic
- Use action verbs (Built, Led, Optimized, Developed)
- If data is missing, intelligently infer from career goal and passion

Return ONLY JSON:
{
  "fullName": "...",
  "headline": "...",
  "email": "...",
  "phone": "...",
  "linkedin": "...",
  "github": "...",
  "locationText": "...",
  "summary": "...",
  "skills": "...",
  "experience": "...",
  "projects": "...",
  "education": "..."
}`;

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash-exp",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192,
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);
    const resumeData = JSON.parse(result.response.text().trim());

    console.log('✅ AI Resume generated successfully');

    res.json({
      success: true,
      resumeData,
      message: 'Resume generated from your profile data!'
    });

  } catch (error) {
    console.error('❌ Resume generation error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate resume',
      error: error.message 
    });
  }
});

// ===== AI RESUME ENHANCEMENT =====
router.post('/enhance-resume-section', authenticateUser, async (req, res) => {
  try {
    const { section, currentContent, targetRole } = req.body;

    const prompt = `You are a resume optimization expert. Enhance this resume section for maximum ATS impact.

SECTION: ${section}
TARGET ROLE: ${targetRole || 'Software Engineer'}
CURRENT CONTENT:
${currentContent}

INSTRUCTIONS:
- Make it ATS-friendly with relevant keywords
- Use strong action verbs (Built, Led, Optimized, Developed, Architected)
- Add QUANTIFIED metrics wherever possible
- Keep bullet points concise (1-2 lines each)
- Sound professional but authentic
- For skills: add 5-10 more relevant skills for the target role
- For experience: add measurable impact metrics
- For summary: make it compelling and keyword-rich

Return ONLY the enhanced content as plain text, ready to paste.`;

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent(prompt);
    const enhancedContent = result.response.text().trim();

    res.json({
      success: true,
      enhancedContent
    });

  } catch (error) {
    console.error('❌ Enhancement error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== SMART JOB DESCRIPTION ANALYZER =====
router.post('/analyze-job-description', authenticateUser, async (req, res) => {
  try {
    const { jobDescription, currentResume } = req.body;

    const prompt = `Analyze this job description and provide ATS optimization insights.

JOB DESCRIPTION:
${jobDescription}

CURRENT RESUME:
${JSON.stringify(currentResume, null, 2)}

Analyze and return JSON with:
{
  "extractedSkills": ["skill1", "skill2", ...], // All required skills from JD
  "matchedSkills": ["skill1", ...], // Skills user already has
  "missingSkills": ["skill1", ...], // Critical skills user needs to add
  "keyPhrases": ["phrase1", ...], // Important phrases to include (e.g., "cross-functional collaboration")
  "suggestedImprovements": [
    "Add 'cloud architecture' to skills section",
    "Quantify team size in experience bullets",
    ...
  ],
  "estimatedAtsScore": 75, // 0-100
  "verdict": "Good Match" // or "Needs Improvement" or "Excellent Match"
}`;

    const genAI = getGeminiClient();
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const result = await model.generateContent(prompt);
    const analysis = JSON.parse(result.response.text().trim());

    res.json({
      success: true,
      ...analysis
    });

  } catch (error) {
    console.error('❌ JD Analysis error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
export default router;
