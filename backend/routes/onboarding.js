import express from 'express';
import Groq from 'groq-sdk';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Initialize Groq client lazily to ensure env vars are loaded
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

// Generate dynamic questions based on user status and passion
router.post('/generate-questions', authenticateUser, async (req, res) => {
  try {
    const { status, passion, previousAnswers = [] } = req.body;

    const systemPrompt = `You are an AI career counselor for SKILLSPHERE, a career guidance platform. Your goal is to gather crucial information to help users with:
1. AI Career Path Recommendations
2. Resume Building & ATS Optimization
3. Personalized Learning Paths
4. Interview Preparation
5. Job Readiness Assessment

Generate exactly 5 personalized, insightful questions based on:
- User Status: ${status}
- User Passion: ${passion}
- Context: ${previousAnswers.length > 0 ? 'Follow-up questions based on: ' + JSON.stringify(previousAnswers) : 'Initial assessment'}

Questions should:
- Be conversational and engaging
- Gather actionable career data
- Assess skill levels, goals, and readiness
- Identify learning gaps and strengths
- Understand timeline and commitment level

Return ONLY a JSON array with this exact structure:
[
  {
    "id": "q1",
    "question": "question text here",
    "placeholder": "example answer here",
    "purpose": "what this question assesses"
  }
]`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate 5 targeted questions for a ${status} interested in ${passion}` }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.7,
      max_tokens: 1500
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Extract JSON from markdown code blocks if present
    let questions;
    if (responseText.includes('```json')) {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      questions = JSON.parse(jsonMatch ? jsonMatch : responseText);[1]
    } else if (responseText.includes('```')) {
      const jsonMatch = responseText.match(/```\n([\s\S]*?)\n```/);
      questions = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
    } else {
      questions = JSON.parse(responseText);
    }

    res.json({ questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ 
      message: 'Failed to generate questions',
      error: error.message 
    });
  }
});

// Get conversational follow-up based on user response
router.post('/conversational-followup', authenticateUser, async (req, res) => {
  try {
    const { currentQuestion, userAnswer, conversationHistory } = req.body;

    const followupPrompt = `You're having a career counseling conversation. The user just answered:
Question: "${currentQuestion}"
Answer: "${userAnswer}"

Previous context: ${JSON.stringify(conversationHistory)}

Provide a brief positive acknowledgment (1-2 sentences) of their answer.

Respond with JSON:
{
  "acknowledgment": "brief positive feedback on their answer"
}`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are an empathetic AI career counselor conducting an interactive assessment.' },
        { role: 'user', content: followupPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 300
    });

    const responseText = completion.choices[0].message.content.trim();
    
    let response;
    if (responseText.includes('```json')) {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      response = JSON.parse(jsonMatch ? jsonMatch : responseText);[1]
    } else if (responseText.includes('```')) {
      const jsonMatch = responseText.match(/```\n([\s\S]*?)\n```/);
      response = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
    } else {
      response = JSON.parse(responseText);
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error generating follow-up:', error);
    res.status(500).json({ 
      acknowledgment: 'Great answer! Let\'s continue.',
      error: error.message 
    });
  }
});

// Analyze user profile and generate career insights
router.post('/analyze-profile', authenticateUser, async (req, res) => {
  try {
    const { status, passion, answers, resume, linkedinData } = req.body;

    console.log('🤖 Analyzing user profile...');

    // Get existing user data
    const user = await User.findById(req.userId);

    const analysisPrompt = `As an AI career advisor for SKILLSPHERE, analyze this user profile and provide comprehensive career insights.

User Profile:
- Status: ${status}
- Passion: ${passion}
- Assessment Answers: ${JSON.stringify(answers)}
${resume ? '- Resume Data: ' + JSON.stringify(resume) : '- No resume uploaded'}
${linkedinData ? '- LinkedIn Data: ' + JSON.stringify(linkedinData) : '- No LinkedIn connected'}
${user?.resumeData ? '- Stored Resume: ' + JSON.stringify(user.resumeData) : ''}
${user?.linkedinData ? '- Stored LinkedIn: Has ' + (user.linkedinData.positions?.length || 0) + ' positions, ' + (user.linkedinData.skills?.length || 0) + ' skills' : ''}

Provide a comprehensive, actionable analysis covering:
1. Career Path Recommendations (3-5 specific roles)
2. Skill Gap Analysis
3. Learning Roadmap with timeline
4. Job Readiness Score (0-100)
5. Interview Preparation Focus
6. Resume Optimization Tips

Keep it concise, actionable, and encouraging.`;

    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: 'You are SKILLSPHERE AI, an expert career counselor. Provide actionable, data-driven insights in a friendly tone.' },
        { role: 'user', content: analysisPrompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.6,
      max_tokens: 2500
    });

    const analysis = completion.choices[0].message.content;

    // Save comprehensive data to user profile
    await User.findByIdAndUpdate(req.userId, {
      onboardingComplete: true,
      'careerProfile.status': status,
      'careerProfile.passion': passion,
      'careerProfile.answers': answers,
      'careerProfile.aiAnalysis': analysis,
      'careerProfile.completedAt': new Date(),
      updatedAt: new Date()
    });

    console.log('✅ Profile analysis complete and saved');

    res.json({ 
      success: true,
      analysis,
      message: 'Your personalized career dashboard is ready!' 
    });
    
  } catch (error) {
    console.error('Error analyzing profile:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to analyze profile',
      error: error.message 
    });
  }
});

export default router;
