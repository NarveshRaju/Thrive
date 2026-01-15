import express from 'express';
import multer from 'multer';
import puppeteer from 'puppeteer';
import Resume from '../models/Resume.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Auth middleware
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.userId = decoded.userId;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Extract resume from PDF - SIMPLIFIED (just returns empty for now)
router.post('/extract', authenticateUser, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // For now, return a message that PDF parsing will be added
    res.json({
      success: true,
      message: 'PDF uploaded successfully. Please manually enter your details for now.',
      fullName: '',
      email: '',
      phone: '',
      linkedin: '',
      github: '',
      locationText: '',
      headline: '',
      summary: '',
      education: '',
      skills: '',
      experience: '',
      projects: ''
    });

  } catch (error) {
    console.error('PDF extraction error:', error);
    res.status(500).json({ error: 'Failed to extract resume data' });
  }
});

// AI Chat - Resume improvement with Groq
router.post('/ai-chat', authenticateUser, async (req, res) => {
  try {
    const { message, resumeData, conversationHistory } = req.body;

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: `You are an expert resume consultant helping users build professional resumes. 
            
Current resume data:
${JSON.stringify(resumeData, null, 2)}

Your job is to:
1. Have a natural conversation to understand their experience
2. Ask clarifying questions about their achievements
3. Suggest improvements using action verbs and quantifiable results
4. Help them articulate impact (e.g., "increased efficiency by 40%")
5. Align content with job descriptions when provided
6. Keep responses concise and actionable

Be conversational, encouraging, and professional.`
          },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    const data = await groqResponse.json();
    const aiResponse = data.choices[0].message.content;

    res.json({
      success: true,
      response: aiResponse
    });

  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ error: 'AI chat failed', message: error.message });
  }
});

// Calculate ATS Score
router.post('/ats-score', authenticateUser, async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;

    const score = calculateATSScore(resumeData, jobDescription);
    
    res.json({
      success: true,
      ...score
    });

  } catch (error) {
    console.error('ATS scoring error:', error);
    res.status(500).json({ error: 'ATS scoring failed' });
  }
});

// Save resume to database
router.post('/save', authenticateUser, async (req, res) => {
  try {
    const { resumeData, atsScore, jobDescription, conversationHistory } = req.body;

    const resume = await Resume.findOneAndUpdate(
      { userId: req.userId },
      {
        userId: req.userId,
        ...resumeData,
        atsScore,
        jobDescription,
        conversationHistory,
        lastUpdated: new Date()
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      resume
    });

  } catch (error) {
    console.error('Save resume error:', error);
    res.status(500).json({ error: 'Failed to save resume' });
  }
});

// Get user's resume
router.get('/get', authenticateUser, async (req, res) => {
  try {
    const resume = await Resume.findOne({ userId: req.userId });

    if (!resume) {
      return res.json({ success: true, resume: null });
    }

    res.json({
      success: true,
      resume
    });

  } catch (error) {
    console.error('Get resume error:', error);
    res.status(500).json({ error: 'Failed to get resume' });
  }
});

// Export resume as PDF
router.post('/export', authenticateUser, async (req, res) => {
  try {
    const resumeData = req.body;

    const html = buildHtmlFromResume(resumeData);

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: { top: '0mm', right: '0mm', bottom: '0mm', left: '0mm' }
    });

    await browser.close();

    // Save to database
    await Resume.findOneAndUpdate(
      { userId: req.userId },
      {
        $push: {
          versions: {
            generatedAt: new Date(),
            pdfData: pdfBuffer.toString('base64')
          }
        }
      }
    );

    res.contentType('application/pdf');
    res.send(pdfBuffer);

  } catch (error) {
    console.error('PDF export error:', error);
    res.status(500).json({ error: 'PDF generation failed' });
  }
});

// Helper: Calculate ATS Score
function calculateATSScore(resumeData, jobDescription) {
  if (!jobDescription) {
    return {
      score: 0,
      verdict: 'No job description provided',
      keywordMatches: [],
      missingKeywords: [],
      suggestions: ['Add a job description to get ATS insights']
    };
  }

  const jdLower = jobDescription.toLowerCase();
  const resumeText = Object.values(resumeData).join(' ').toLowerCase();

  const commonWords = new Set(['the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being']);
  const jdWords = jdLower.match(/\b[a-z]{3,}\b/g) || [];
  const keywords = [...new Set(jdWords.filter(w => !commonWords.has(w)))];

  const keywordMatches = [];
  const missingKeywords = [];

  keywords.forEach(keyword => {
    if (resumeText.includes(keyword)) {
      keywordMatches.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  const matchRate = keywords.length > 0 ? (keywordMatches.length / keywords.length) * 100 : 0;
  
  let score = Math.round(matchRate);
  let verdict = '';
  
  if (score >= 80) verdict = 'Excellent match!';
  else if (score >= 60) verdict = 'Good match';
  else if (score >= 40) verdict = 'Fair match';
  else verdict = 'Needs improvement';

  const suggestions = [];
  if (missingKeywords.length > 0) {
    suggestions.push(`Add these keywords: ${missingKeywords.slice(0, 5).join(', ')}`);
  }
  if (!resumeData.skills) suggestions.push('Add a skills section');
  if (!resumeData.experience) suggestions.push('Add work experience');

  return {
    score,
    verdict,
    keywordMatches: keywordMatches.slice(0, 10),
    missingKeywords: missingKeywords.slice(0, 10),
    suggestions
  };
}

// Helper: Build HTML for PDF
function buildHtmlFromResume(resume) {
  const {
    fullName = '',
    headline = '',
    email = '',
    phone = '',
    linkedin = '',
    github = '',
    locationText = '',
    summary = '',
    skills = '',
    experience = '',
    projects = '',
    education = ''
  } = resume;

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase();
  };

  const initials = getInitials(fullName);

  const renderBullets = (text) => {
    if (!text) return '';
    return text.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const trimmed = line.trim();
        return trimmed.startsWith('•') ? trimmed : '• ' + trimmed;
      })
      .map(line => `<p style="margin: 4px 0;">${line}</p>`)
      .join('');
  };

  const renderSkills = (text) => {
    if (!text) return '';
    return text.split(/[,\n]/)
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .map(skill => `<span style="display: inline-block; background: #1a1a1a; color: #f59e0b; padding: 4px 12px; border-radius: 12px; margin: 4px; font-size: 12px; font-weight: 500;">${skill}</span>`)
      .join('');
  };

  const contactParts = [locationText, phone, email, linkedin, github].filter(Boolean);
  const contactLine = contactParts.join(' | ');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      background: white;
      color: #1a1a1a;
    }
    .header {
      background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
      color: white;
      padding: 40px;
      text-align: center;
    }
    .avatar {
      width: 80px;
      height: 80px;
      background: #f59e0b;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      font-weight: bold;
      color: white;
      margin-bottom: 16px;
    }
    .name {
      font-size: 32px;
      font-weight: bold;
      margin-bottom: 8px;
    }
    .headline {
      font-size: 16px;
      color: #f59e0b;
      margin-bottom: 12px;
    }
    .contact {
      font-size: 12px;
      color: #ccc;
    }
    .content {
      padding: 40px;
    }
    .section {
      margin-bottom: 24px;
    }
    .section-title {
      font-size: 18px;
      font-weight: bold;
      color: #f59e0b;
      border-bottom: 2px solid #f59e0b;
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .section-content {
      font-size: 14px;
      line-height: 1.6;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="header">
    <div class="avatar">${initials}</div>
    <div class="name">${fullName || 'Your Name'}</div>
    ${headline ? `<div class="headline">${headline}</div>` : ''}
    <div class="contact">${contactLine}</div>
  </div>
  
  <div class="content">
    ${summary ? `
      <div class="section">
        <div class="section-title">SUMMARY</div>
        <div class="section-content">${summary}</div>
      </div>
    ` : ''}
    
    ${skills ? `
      <div class="section">
        <div class="section-title">SKILLS</div>
        <div class="section-content">${renderSkills(skills)}</div>
      </div>
    ` : ''}
    
    ${experience ? `
      <div class="section">
        <div class="section-title">EXPERIENCE</div>
        <div class="section-content">${renderBullets(experience)}</div>
      </div>
    ` : ''}
    
    ${projects ? `
      <div class="section">
        <div class="section-title">PROJECTS</div>
        <div class="section-content">${renderBullets(projects)}</div>
      </div>
    ` : ''}
    
    ${education ? `
      <div class="section">
        <div class="section-title">EDUCATION</div>
        <div class="section-content">${renderBullets(education)}</div>
      </div>
    ` : ''}
  </div>
</body>
</html>
  `;
}

export default router;
