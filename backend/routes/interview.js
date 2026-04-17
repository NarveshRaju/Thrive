import express from 'express';
import jwt from 'jsonwebtoken';
import Groq from 'groq-sdk';
import Interview from '../models/Interview.js';
import User from '../models/User.js';

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

// Create new interview room
router.post('/create-room', authenticateUser, async (req, res) => {
  try {
    const { candidateName, interviewType, difficulty, targetRole, industry, focusAreas } = req.body;
    
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Generate unique room ID
    const roomId = `interview_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const interview = new Interview({
      userId: req.userId,
      roomId,
      candidateName: candidateName || user.username,
      interviewType: interviewType || 'role-specific',
      difficulty: difficulty || 'medium',
      status: 'scheduled',
      targetRole: targetRole || '',
      industry: industry || '',
      focusAreas: focusAreas || '',
      participants: [{
        userId: req.userId,
        role: 'candidate',
        joinedAt: new Date()
      }]
    });

    await interview.save();

    console.log('✅ Interview room created:', roomId);

    res.json({
      success: true,
      roomId,
      joinUrl: interview.joinUrl,
      interview: {
        id: interview._id,
        roomId: interview.roomId,
        candidateName: interview.candidateName,
        interviewType: interview.interviewType,
        difficulty: interview.difficulty,
        status: interview.status
      }
    });

  } catch (error) {
    console.error('❌ Error creating interview room:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create interview room',
      error: error.message 
    });
  }
});

// Get interview by room ID
router.get('/room/:roomId', authenticateUser, async (req, res) => {
  try {
    const { roomId } = req.params;
    
    const interview = await Interview.findOne({ roomId })
      .populate('userId', 'username email');
    
    if (!interview) {
      return res.status(404).json({ 
        success: false,
        message: 'Interview not found' 
      });
    }

    // Check if user owns this interview
    if (interview.userId._id.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      interview
    });

  } catch (error) {
    console.error('❌ Error fetching interview:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch interview' 
    });
  }
});

// Start interview
router.post('/start/:roomId', authenticateUser, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { retellCallId } = req.body;

    const interview = await Interview.findOne({ roomId });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.status = 'in-progress';
    interview.startTime = new Date();
    interview.callStartedAt = new Date();
    if (retellCallId) interview.retellCallId = retellCallId;
    
    await interview.save();

    console.log('✅ Interview started:', roomId);

    res.json({
      success: true,
      message: 'Interview started',
      interview: {
        id: interview._id,
        status: interview.status,
        startTime: interview.startTime
      }
    });

  } catch (error) {
    console.error('❌ Error starting interview:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to start interview' 
    });
  }
});

// AI Interview Chat - Personalized questions for any field
router.post('/chat/:roomId', authenticateUser, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { message, history, interviewType, difficulty, targetRole, industry, focusAreas, candidateName, questionNumber, maxQuestions } = req.body;

    const isStart = message === '__START_INTERVIEW__';

    const roleDesc = targetRole || 'professional';
    const industryDesc = industry || 'general';
    const typeDesc = {
      'role-specific': `role-specific interview for a ${roleDesc} position in ${industryDesc}`,
      'behavioral': 'behavioral interview focusing on leadership, teamwork, conflict resolution, and situational questions',
      'technical': `domain-specific technical interview for ${roleDesc} in ${industryDesc}`,
      'case-study': `case study and problem solving interview for ${roleDesc} in ${industryDesc}`,
      'hr-cultural': 'HR and culture fit interview covering motivation, salary expectations, and career goals',
    }[interviewType] || `general interview for ${roleDesc}`;

    const difficultyDesc = {
      'easy': 'fresher/entry-level (0-1 years experience)',
      'medium': 'mid-level (2-5 years experience)', 
      'hard': 'senior-level (5+ years experience)'
    }[difficulty] || 'mid-level';

    const systemPrompt = `You are an experienced, professional interviewer conducting a ${typeDesc}.

CANDIDATE: ${candidateName || 'the candidate'}
DIFFICULTY: ${difficultyDesc}
${focusAreas ? `FOCUS AREAS: ${focusAreas}` : ''}
${industry ? `INDUSTRY: ${industry}` : ''}

RULES:
- Ask ONE question at a time
- Keep questions concise and clear
- Adapt difficulty based on the candidate's responses
- Be professional but warm and encouraging
- After each answer, briefly acknowledge it (1 sentence) before asking the next question
- Questions should be relevant to the role and industry, NOT generic
- Do NOT ask coding questions unless the role is specifically a developer/engineer role
- Mix different question types: situational, competency-based, knowledge-based
- ${isStart ? 'Start with a warm greeting and your first question.' : ''}
- ${(questionNumber || 0) >= (maxQuestions || 8) ? 'This is the last question. After this, wrap up the interview with a brief positive closing remark.' : ''}
- Keep your response under 150 words`;

    const messages = [
      { role: 'system', content: systemPrompt },
    ];

    if (isStart) {
      messages.push({ role: 'user', content: `Please start the interview with a brief greeting and your first question for a ${roleDesc} position.` });
    } else {
      // Add conversation history
      if (history && history.length > 0) {
        messages.push(...history);
      }
    }

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 500
    });

    const aiResponse = completion.choices[0].message.content.trim();

    res.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ success: false, message: 'AI chat failed', error: error.message });
  }
});

// Update transcript in real-time
router.post('/update-transcript/:roomId', authenticateUser, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { transcript } = req.body;

    const interview = await Interview.findOne({ roomId });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.transcript = transcript;
    await interview.save();

    res.json({
      success: true,
      message: 'Transcript updated'
    });

  } catch (error) {
    console.error('❌ Error updating transcript:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update transcript' 
    });
  }
});

// Submit code
router.post('/submit-code/:roomId', authenticateUser, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { code, language } = req.body;

    const interview = await Interview.findOne({ roomId });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.codeSubmitted = {
      code,
      language,
      submittedAt: new Date()
    };

    await interview.save();

    res.json({
      success: true,
      message: 'Code submitted successfully'
    });

  } catch (error) {
    console.error('❌ Error submitting code:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to submit code' 
    });
  }
});

// Add code analysis to history
router.post('/add-code-analysis/:roomId', authenticateUser, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { code, analysis, scores } = req.body;

    const interview = await Interview.findOne({ roomId });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.codeAnalyses.push({
      code,
      analysis,
      scores,
      timestamp: new Date()
    });

    await interview.save();

    res.json({
      success: true,
      message: 'Code analysis saved'
    });

  } catch (error) {
    console.error('❌ Error saving code analysis:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save code analysis' 
    });
  }
});

// End interview and generate full analysis
router.post('/end/:roomId', authenticateUser, async (req, res) => {
  try {
    const { roomId } = req.params;
    const { scores, transcript, code, language, recordingUrl } = req.body;

    const interview = await Interview.findOne({ roomId });
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Update interview data
    interview.status = 'completed';
    interview.endTime = new Date();
    interview.callEndedAt = new Date();
    interview.duration = interview.calculateDuration();
    interview.completedAt = new Date();
    
    if (recordingUrl) interview.recordingUrl = recordingUrl;
    if (transcript) interview.transcript = transcript;
    if (code) {
      interview.codeSubmitted = { 
        code, 
        language: language || 'javascript', 
        submittedAt: new Date() 
      };
    }
    if (scores) interview.scores = { ...interview.scores, ...scores };

    // Generate comprehensive AI analysis
    console.log('🤖 Generating comprehensive interview analysis...');
    
    const analysisPrompt = `You are an expert technical interviewer and career coach. Analyze this complete interview session and provide comprehensive, constructive feedback.

Interview Details:
- Candidate: ${interview.candidateName}
- Type: ${interview.interviewType}
- Difficulty: ${interview.difficulty}
- Duration: ${interview.duration} seconds (${Math.round(interview.duration / 60)} minutes)

Performance Scores:
- Code Quality: ${scores?.codeQuality || 0}/100
- Communication: ${scores?.communication || 0}/100
- Problem Solving: ${scores?.problemSolving || 0}/100
- Technical Knowledge: ${scores?.technicalKnowledge || 0}/100
- Overall: ${scores?.overall || 0}/100

Code Submitted (${language}):
\`\`\`${language}
${code || 'No code submitted'}
\`\`\`

Conversation Transcript:
${JSON.stringify(transcript?.slice(0, 20) || [], null, 2)}

Code Analysis History:
${JSON.stringify(interview.codeAnalyses.slice(-3) || [], null, 2)}

Provide detailed, actionable feedback in JSON format:
{
  "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
  "weaknesses": ["specific weakness 1", "specific weakness 2"],
  "recommendations": ["actionable recommendation 1", "actionable recommendation 2", "actionable recommendation 3"],
  "codeReview": "Detailed code review with specific examples and suggestions (2-3 paragraphs)",
  "communicationFeedback": "Analysis of communication skills, clarity, and articulation (1-2 paragraphs)",
  "technicalFeedback": "Assessment of technical knowledge and problem-solving approach (1-2 paragraphs)",
  "overallFeedback": "Comprehensive summary with overall assessment and encouragement (2-3 paragraphs)",
  "detailedReport": "Full professional interview report suitable for sharing (3-4 paragraphs)"
}

Be specific, constructive, and encouraging. Provide actionable insights.`;

    try {
      const groq = getGroqClient();
      const completion = await groq.chat.completions.create({
        messages: [
          { 
            role: 'system', 
            content: 'You are an expert technical interviewer and career coach with 15+ years of experience. Provide constructive, specific, and encouraging feedback that helps candidates improve.'
          },
          { role: 'user', content: analysisPrompt }
        ],
        model: 'llama-3.3-70b-versatile',
        temperature: 0.7,
        max_tokens: 3500
      });

      const responseText = completion.choices[0].message.content.trim();
      
      let aiAnalysis;
      if (responseText.includes('```json')) {
        const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
        aiAnalysis = JSON.parse(jsonMatch ? jsonMatch : responseText);[2]
      } else if (responseText.includes('```')) {
        const jsonMatch = responseText.match(/```\n([\s\S]*?)\n```/);
        aiAnalysis = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
      } else {
        aiAnalysis = JSON.parse(responseText);
      }

      aiAnalysis.generatedAt = new Date();
      interview.aiAnalysis = aiAnalysis;
      
      console.log('✅ AI analysis generated successfully');

    } catch (error) {
      console.error('⚠️ AI analysis failed:', error);
      // Create basic analysis if AI fails
      interview.aiAnalysis = {
        strengths: ['Completed the interview'],
        weaknesses: ['Analysis could not be generated'],
        recommendations: ['Review the transcript and code'],
        overallFeedback: 'Interview completed. Detailed analysis unavailable.',
        generatedAt: new Date()
      };
    }

    await interview.save();

    // Update user statistics
    const user = await User.findById(req.userId);
    
    if (!user.interviewHistory) user.interviewHistory = [];
    if (!user.interviewStats) user.interviewStats = {};
    
    user.interviewHistory.push({
      interviewId: interview._id,
      completedAt: interview.completedAt,
      overallScore: scores?.overall || 0,
      interviewType: interview.interviewType,
      duration: interview.duration
    });

    user.interviewStats.totalInterviews = (user.interviewStats.totalInterviews || 0) + 1;
    user.interviewStats.totalDuration = (user.interviewStats.totalDuration || 0) + interview.duration;
    
    const allScores = user.interviewHistory.map(h => h.overallScore);
    user.interviewStats.averageScore = Math.round(
      allScores.reduce((sum, score) => sum + score, 0) / allScores.length
    );
    
    user.interviewStats.bestScore = Math.max(...allScores, user.interviewStats.bestScore || 0);
    user.interviewStats.lastInterviewDate = interview.completedAt;
    
    // Update interview type counters
    if (!user.interviewStats.interviewsByType) {
      user.interviewStats.interviewsByType = {};
    }
    const typeKey = interview.interviewType.replace('-', '');
    user.interviewStats.interviewsByType[typeKey] = 
      (user.interviewStats.interviewsByType[typeKey] || 0) + 1;

    await user.save();

    console.log('✅ Interview completed and saved:', roomId);
    console.log(`   - Duration: ${interview.duration}s`);
    console.log(`   - Overall Score: ${scores?.overall || 0}`);
    console.log(`   - User total interviews: ${user.interviewStats.totalInterviews}`);

    res.json({
      success: true,
      message: 'Interview completed successfully',
      interview: {
        id: interview._id,
        roomId: interview.roomId,
        scores: interview.scores,
        aiAnalysis: interview.aiAnalysis,
        duration: interview.duration,
        completedAt: interview.completedAt
      },
      userStats: user.interviewStats
    });

  } catch (error) {
    console.error('❌ Error ending interview:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to end interview',
      error: error.message 
    });
  }
});

// Get user's interview history
router.get('/history', authenticateUser, async (req, res) => {
  try {
    const { limit = 10, page = 1 } = req.query;
    
    const interviews = await Interview.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .select('-transcript -codeSubmitted.code -codeAnalyses');

    const total = await Interview.countDocuments({ userId: req.userId });
    
    const user = await User.findById(req.userId).select('interviewStats');

    res.json({
      success: true,
      interviews,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      },
      stats: user.interviewStats || {
        totalInterviews: 0,
        averageScore: 0,
        bestScore: 0,
        totalDuration: 0
      }
    });

  } catch (error) {
    console.error('❌ Error fetching interview history:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch interview history' 
    });
  }
});

// Get specific interview details
router.get('/details/:interviewId', authenticateUser, async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    const interview = await Interview.findById(interviewId)
      .populate('userId', 'username email');
    
    if (!interview) {
      return res.status(404).json({ 
        success: false,
        message: 'Interview not found' 
      });
    }

    if (interview.userId._id.toString() !== req.userId) {
      return res.status(403).json({ 
        success: false,
        message: 'Access denied' 
      });
    }

    res.json({
      success: true,
      interview
    });

  } catch (error) {
    console.error('❌ Error fetching interview details:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch interview details' 
    });
  }
});

// Delete interview
router.delete('/:interviewId', authenticateUser, async (req, res) => {
  try {
    const { interviewId } = req.params;
    
    const interview = await Interview.findById(interviewId);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    if (interview.userId.toString() !== req.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    await Interview.findByIdAndDelete(interviewId);

    console.log('✅ Interview deleted:', interviewId);

    res.json({
      success: true,
      message: 'Interview deleted successfully'
    });

  } catch (error) {
    console.error('❌ Error deleting interview:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete interview' 
    });
  }
});

export default router;
