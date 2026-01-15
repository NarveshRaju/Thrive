import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Groq from 'groq-sdk';

const getGroqClient = () => {
  return new Groq({ apiKey: process.env.GROQ_API_KEY });
};

export const parseResume = async (fileBuffer) => {
  try {
    // Extract text from PDF
    const pdfData = await pdfParse(fileBuffer);
    const resumeText = pdfData.text;

    // Use Groq AI to extract structured data
    const groq = getGroqClient();
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a resume parser. Extract structured information from the resume text and return ONLY valid JSON with this exact structure:
{
  "name": "full name",
  "email": "email address",
  "phone": "phone number",
  "location": "city, state/country",
  "summary": "professional summary",
  "skills": ["skill1", "skill2"],
  "experience": [
    {
      "company": "company name",
      "position": "job title",
      "duration": "start - end",
      "description": "what they did"
    }
  ],
  "education": [
    {
      "institution": "school name",
      "degree": "degree type",
      "field": "field of study",
      "year": "graduation year"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "projects": [
    {
      "name": "project name",
      "description": "brief description",
      "technologies": ["tech1", "tech2"]
    }
  ]
}`
        },
        {
          role: 'user',
          content: `Parse this resume:\n\n${resumeText}`
        }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.3,
      max_tokens: 2000
    });

    const responseText = completion.choices[0].message.content.trim();
    
    // Extract JSON from markdown code blocks if present
    let parsedData;
    if (responseText.includes('```json')) {
      const jsonMatch = responseText.match(/```json\n([\s\S]*?)\n```/);
      parsedData = JSON.parse(jsonMatch ? jsonMatch : responseText);[1]
    } else if (responseText.includes('```')) {
      const jsonMatch = responseText.match(/```\n([\s\S]*?)\n```/);
      parsedData = JSON.parse(jsonMatch ? jsonMatch[1] : responseText);
    } else {
      parsedData = JSON.parse(responseText);
    }

    return {
      success: true,
      data: parsedData,
      rawText: resumeText
    };
  } catch (error) {
    console.error('Resume parsing error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
