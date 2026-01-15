import express from 'express';
import Groq from 'groq-sdk';

const router = express.Router();

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY not configured');
  }
  return new Groq({ apiKey });
}

router.post('/analyze-code', async (req, res) => {
  try {
    const { code, language, context } = req.body;

    console.log('🔍 Analyzing code:', language);

    const groq = getGroqClient();

    const completion = await groq.chat.completions.create({
      messages: [{
        role: 'user',
        content: `You are a code reviewer. Analyze this ${language} code and provide scores (0-100).

Code:
\`\`\`${language}
${code}
\`\`\`

Context: ${context}

Respond with ONLY valid JSON (no markdown, no extra text):
{
  "scores": {
    "quality": 85,
    "correctness": 90,
    "efficiency": 75
  },
  "feedback": "Brief 1-sentence feedback"
}`
      }],
      model: 'llama-3.1-70b-versatile',
      temperature: 0.3,
      max_tokens: 500
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Remove markdown code blocks if present
    const jsonText = responseText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const result = JSON.parse(jsonText);
    
    console.log('✅ Analysis complete:', result.scores);
    
    res.json(result);

  } catch (error) {
    console.error('❌ Groq analysis error:', error);
    res.status(500).json({ 
      error: 'Analysis failed',
      details: error.message 
    });
  }
});

export default router;
