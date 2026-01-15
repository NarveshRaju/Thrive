// Generate fully AI-powered career paths with complete details
router.post('/generate-complete-career-paths', authenticateUser, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('🎯 Generating COMPLETE AI career paths for:', user.username);

    // Compile comprehensive user profile
    const userProfile = {
      passion: user.careerProfile?.passion || 'technology and innovation',
      status: user.careerProfile?.status || 'exploring',
      answers: user.careerProfile?.answers || {},
      skills: [
        ...(user.resumeData?.skills || []),
        ...(user.linkedinData?.skills || [])
      ].filter((v, i, a) => a.indexOf(v) === i),
      experience: user.resumeData?.experience || user.linkedinData?.positions || [],
      education: user.resumeData?.education || user.linkedinData?.education || [],
      projects: user.resumeData?.projects || [],
      currentRole: user.linkedinData?.headline || user.resumeData?.summary || 'aspiring professional',
      certifications: user.resumeData?.certifications || user.linkedinData?.certifications || [],
      languages: user.linkedinData?.languages || [],
      summary: user.resumeData?.summary || user.linkedinData?.summary || '',
      yearsOfExperience: user.resumeData?.experience?.length || 0
    };

    const careerPathPrompt = `You are an expert career counselor with deep knowledge of tech careers. Analyze this user's profile and generate 5 PERSONALIZED career paths ranked by match percentage.

USER PROFILE:
- Passion/Interest: ${userProfile.passion}
- Career Status: ${userProfile.status}
- Current Role: ${userProfile.currentRole}
- Skills (${userProfile.skills.length}): ${userProfile.skills.slice(0, 15).join(', ')}
- Experience: ${userProfile.yearsOfExperience} positions
- Education: ${userProfile.education.map(e => e.degree || e.field || 'studied').join(', ')}
- Projects: ${userProfile.projects.length} projects
- Summary: ${userProfile.summary}

Generate 5 tech career paths that are HIGHLY RELEVANT to this user's profile. Each career should be completely personalized with:

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "topRecommendation": "Career title with highest match",
  "personalizedMessage": "A warm, encouraging 2-sentence message about their career journey based on their passion and skills",
  "careers": [
    {
      "title": "Exact career title (e.g., Full Stack Developer)",
      "matchScore": 92,
      "planet": "mercury",
      "size": 65,
      "description": "Personalized 1-2 sentence description explaining why THIS career fits THEIR profile",
      "salary": "$80k - $150k",
      "growth": "+25%",
      "demand": "Very High",
      "whyMatch": [
        "Specific reason based on their passion",
        "Specific reason based on their current skills",
        "Specific reason based on their experience or goals"
      ],
      "requiredSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
      "skillsYouHave": ["skill they already have 1", "skill they already have 2"],
      "skillsToLearn": ["skill gap 1", "skill gap 2", "skill gap 3"],
      "industryTrends": [
        "Current trend 1 in 2026",
        "Current trend 2 in 2026",
        "Current trend 3 in 2026",
        "Current trend 4 in 2026"
      ],
      "roadmap": [
        {
          "phase": "Foundation",
          "duration": "2-4 months",
          "description": "What you'll learn in this phase",
          "topics": ["topic1", "topic2", "topic3", "topic4"]
        },
        {
          "phase": "Intermediate",
          "duration": "4-8 months",
          "description": "Building core expertise",
          "topics": ["topic1", "topic2", "topic3", "topic4"]
        },
        {
          "phase": "Advanced",
          "duration": "6-12 months",
          "description": "Mastering advanced concepts",
          "topics": ["topic1", "topic2", "topic3", "topic4"]
        },
        {
          "phase": "Expert",
          "duration": "Ongoing",
          "description": "Continuous learning and specialization",
          "topics": ["topic1", "topic2", "topic3"]
        }
      ],
      "learningResources": [
        "Specific platform/course 1 for this career",
        "Specific platform/course 2",
        "Specific platform/course 3",
        "Specific platform/course 4"
      ],
      "nextSteps": [
        "Immediate action step 1 based on their current level",
        "Immediate action step 2",
        "Immediate action step 3"
      ],
      "estimatedTimeToJob": "6-12 months with focused learning"
    }
  ]
}

IMPORTANT:
1. Match scores should range from 65-95 (highest match first)
2. Use different planet names: mercury, venus, earth, mars, jupiter (no saturn)
3. Planet sizes: 50-90 (higher match = bigger size)
4. Make ALL content specific to the user's profile
5. Be honest about skill gaps but encouraging
6. Provide actionable, real-world advice
7. Sort careers by matchScore (highest first)
8. Top 5 careers only

Base your recommendations on their actual data. If they love "${userProfile.passion}", make sure careers align with that passion.`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        { 
          role: 'system', 
          content: 'You are a world-class career counselor specializing in tech careers. You provide deeply personalized, actionable career guidance based on individual profiles. Be warm, encouraging, and specific.' 
        },
        { role: 'user', content: careerPathPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 4000
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Parse AI response
    let aiCareerPaths;
    try {
      const jsonText = responseText
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();
      aiCareerPaths = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ Failed to parse AI career paths:', parseError);
      console.error('Response:', responseText.substring(0, 500));
      throw new Error('Failed to parse AI response');
    }

    // Add metadata and map icons
    const iconMap = {
      'Full Stack Developer': 'Code',
      'Data Scientist': 'Database',
      'UI/UX Designer': 'Palette',
      'DevOps Engineer': 'Shield',
      'Product Manager': 'Briefcase',
      'Machine Learning Engineer': 'Database',
      'Frontend Developer': 'Code',
      'Backend Developer': 'Code',
      'Mobile Developer': 'Code',
      'Cloud Architect': 'Shield',
      'AI Engineer': 'Database',
      'Cybersecurity Specialist': 'Shield',
      'Blockchain Developer': 'LineChart',
      'Game Developer': 'Code',
      'QA Engineer': 'Shield'
    };

    aiCareerPaths.careers = aiCareerPaths.careers.map((career, index) => ({
      ...career,
      id: index + 1,
      icon: iconMap[career.title] || 'Code',
      generatedAt: new Date()
    }));

    // Save to user profile
    await User.findByIdAndUpdate(req.userId, {
      'aiInsights.completeCareerPaths': aiCareerPaths,
      'aiInsights.topCareerRecommendation': aiCareerPaths.topRecommendation,
      'aiInsights.careerPathsGeneratedAt': new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Complete AI career paths generated');
    console.log(`   Top Match: ${aiCareerPaths.topRecommendation}`);
    console.log(`   Careers: ${aiCareerPaths.careers.map(c => `${c.title} (${c.matchScore}%)`).join(', ')}`);

    res.json({
      success: true,
      ...aiCareerPaths
    });

  } catch (error) {
    console.error('❌ Error generating complete career paths:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to generate career paths',
      error: error.message 
    });
  }
});

module.exports = router;