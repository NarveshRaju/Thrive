import express from 'express';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import passport from 'passport';
import axios from 'axios';
import User from '../models/User.js';
import { parseResume } from '../services/resumeParser.js';

const router = express.Router();
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

console.log('🌐 Frontend URL configured as:', FRONTEND_URL);

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || 
        file.mimetype === 'application/msword' ||
        file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and DOC files are allowed'));
    }
  }
});

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

// Helper function to fetch comprehensive LinkedIn profile data
async function fetchLinkedInProfileData(accessToken) {
  try {
    const linkedinData = {
      basicProfile: null,
      profilePicture: null,
      positions: [],
      education: [],
      skills: [],
      posts: [],
      languages: [],
      certifications: []
    };

    // 1. Fetch Basic Profile (OpenID Connect userinfo)
    console.log('📥 Fetching basic profile...');
    const basicProfileResponse = await axios.get('https://api.linkedin.com/v2/userinfo', {
      headers: { 
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    linkedinData.basicProfile = basicProfileResponse.data;
    console.log('✅ Basic profile fetched');

    // 2. Fetch Detailed Profile Information
    console.log('📥 Fetching detailed profile...');
    try {
      const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      linkedinData.detailedProfile = profileResponse.data;
      console.log('✅ Detailed profile fetched');
    } catch (error) {
      console.log('⚠️  Detailed profile not available:', error.response?.status);
    }

    // 3. Fetch Profile Picture
    console.log('📥 Fetching profile picture...');
    try {
      const pictureResponse = await axios.get('https://api.linkedin.com/v2/me?projection=(id,profilePicture(displayImage~:playableStreams))', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      linkedinData.profilePicture = pictureResponse.data.profilePicture;
      console.log('✅ Profile picture fetched');
    } catch (error) {
      console.log('⚠️  Profile picture not available:', error.response?.status);
    }

    // 4. Fetch Work Experience/Positions
    console.log('📥 Fetching positions...');
    try {
      const positionsResponse = await axios.get('https://api.linkedin.com/v2/positions?q=person&person=~', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      linkedinData.positions = positionsResponse.data.elements || [];
      console.log(`✅ Fetched ${linkedinData.positions.length} positions`);
    } catch (error) {
      console.log('⚠️  Positions not available:', error.response?.status);
    }

    // 5. Fetch Education
    console.log('📥 Fetching education...');
    try {
      const educationResponse = await axios.get('https://api.linkedin.com/v2/educations?q=person&person=~', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      linkedinData.education = educationResponse.data.elements || [];
      console.log(`✅ Fetched ${linkedinData.education.length} education entries`);
    } catch (error) {
      console.log('⚠️  Education not available:', error.response?.status);
    }

    // 6. Fetch Skills
    console.log('📥 Fetching skills...');
    try {
      const skillsResponse = await axios.get('https://api.linkedin.com/v2/skills?q=person&person=~', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      linkedinData.skills = skillsResponse.data.elements || [];
      console.log(`✅ Fetched ${linkedinData.skills.length} skills`);
    } catch (error) {
      console.log('⚠️  Skills not available:', error.response?.status);
    }

    // 7. Fetch Posts/Shares (if w_member_social permission is granted)
    console.log('📥 Fetching posts...');
    try {
      const postsResponse = await axios.get('https://api.linkedin.com/v2/ugcPosts?q=authors&authors=List(urn:li:person:PERSON_ID)', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'X-Restli-Protocol-Version': '2.0.0'
        }
      });
      linkedinData.posts = postsResponse.data.elements || [];
      console.log(`✅ Fetched ${linkedinData.posts.length} posts`);
    } catch (error) {
      console.log('⚠️  Posts not available:', error.response?.status);
    }

    // 8. Fetch Certifications
    console.log('📥 Fetching certifications...');
    try {
      const certificationsResponse = await axios.get('https://api.linkedin.com/v2/certifications?q=person&person=~', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      linkedinData.certifications = certificationsResponse.data.elements || [];
      console.log(`✅ Fetched ${linkedinData.certifications.length} certifications`);
    } catch (error) {
      console.log('⚠️  Certifications not available:', error.response?.status);
    }

    // 9. Fetch Languages
    console.log('📥 Fetching languages...');
    try {
      const languagesResponse = await axios.get('https://api.linkedin.com/v2/languages?q=person&person=~', {
        headers: { 
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      });
      linkedinData.languages = languagesResponse.data.elements || [];
      console.log(`✅ Fetched ${linkedinData.languages.length} languages`);
    } catch (error) {
      console.log('⚠️  Languages not available:', error.response?.status);
    }

    return linkedinData;

  } catch (error) {
    console.error('❌ Error fetching LinkedIn data:', error.message);
    throw error;
  }
}

// Sign Up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (existingUser) {
      return res.status(400).json({ 
        message: existingUser.email === email 
          ? 'Email already registered' 
          : 'Username already taken' 
      });
    }

    const user = new User({ username, email, password });
    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

// Verify Token
router.get('/verify', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    const user = await User.findById(decoded.userId).select('-password');

    res.json({ user });
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
});

// Resume Upload & Parse
router.post('/upload-resume', authenticateUser, upload.single('resume'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const parseResult = await parseResume(req.file.buffer);

    if (!parseResult.success) {
      return res.status(500).json({ message: 'Failed to parse resume' });
    }

    await User.findByIdAndUpdate(req.userId, {
      resumeData: parseResult.data,
      resumeRawText: parseResult.rawText,
      resumeUploadedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Resume parsed successfully',
      data: parseResult.data
    });
  } catch (error) {
    console.error('Resume upload error:', error);
    res.status(500).json({ message: 'Failed to upload resume' });
  }
});

// LinkedIn OAuth - Initiate
router.get('/linkedin', (req, res, next) => {
  console.log('🔵 Initiating LinkedIn OAuth...');
  passport.authenticate('linkedin', { 
    session: false
  })(req, res, next);
});

// LinkedIn OAuth - Callback
router.get('/linkedin/callback', (req, res, next) => {
  console.log('🔵 LinkedIn callback hit');
  console.log('Query params:', req.query);
  
  // Check for OAuth errors first
  if (req.query.error) {
    console.error('❌ LinkedIn OAuth error:', req.query.error);
    console.error('Error description:', req.query.error_description);
    return res.redirect(`${FRONTEND_URL}/onboarding?error=${req.query.error}&description=${encodeURIComponent(req.query.error_description || '')}`);
  }
  
  passport.authenticate('linkedin', { 
    failureRedirect: `${FRONTEND_URL}/onboarding?error=linkedin_auth_failed`,
    session: false 
  }, async (err, user, info) => {
    if (err) {
      console.error('❌ Passport authentication error:', err);
      console.error('Error stack:', err.stack);
      return res.redirect(`${FRONTEND_URL}/onboarding?error=auth_error&message=${encodeURIComponent(err.message)}`);
    }
    
    if (!user) {
      console.error('❌ No user returned from passport');
      console.log('Info object:', info);
      return res.redirect(`${FRONTEND_URL}/onboarding?error=no_user`);
    }
    
    try {
      console.log('✅ User authenticated via LinkedIn');
      
      const accessToken = user.accessToken;
      
      if (!accessToken) {
        throw new Error('No access token received from LinkedIn');
      }

      console.log('🔑 Access token received');
      console.log('📊 Fetching comprehensive LinkedIn profile data...');

      // Fetch all LinkedIn data
      const linkedinData = await fetchLinkedInProfileData(accessToken);

      // Create simplified data object for frontend
      const frontendData = {
        id: linkedinData.basicProfile.sub,
        firstName: linkedinData.basicProfile.given_name || '',
        lastName: linkedinData.basicProfile.family_name || '',
        email: linkedinData.basicProfile.email,
        profilePicture: linkedinData.basicProfile.picture || null,
        headline: linkedinData.detailedProfile?.headline || '',
        summary: linkedinData.detailedProfile?.summary || '',
        
        // Work Experience Summary
        positions: linkedinData.positions.map(pos => ({
          title: pos.title,
          company: pos.companyName,
          startDate: pos.timePeriod?.startDate,
          endDate: pos.timePeriod?.endDate,
          description: pos.description,
          location: pos.locationName
        })),
        
        // Education Summary
        education: linkedinData.education.map(edu => ({
          school: edu.schoolName,
          degree: edu.degreeName,
          field: edu.fieldOfStudy,
          startDate: edu.timePeriod?.startDate,
          endDate: edu.timePeriod?.endDate,
          activities: edu.activities,
          grade: edu.grade
        })),
        
        // Skills Summary
        skills: linkedinData.skills.map(skill => skill.name),
        
        // Posts Summary
        postsCount: linkedinData.posts.length,
        recentPosts: linkedinData.posts.slice(0, 5).map(post => ({
          text: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text,
          created: post.created
        })),
        
        // Certifications
        certifications: linkedinData.certifications.map(cert => ({
          name: cert.name,
          authority: cert.authority,
          startDate: cert.timePeriod?.startDate,
          endDate: cert.timePeriod?.endDate,
          licenseNumber: cert.licenseNumber
        })),
        
        // Languages
        languages: linkedinData.languages.map(lang => ({
          name: lang.name,
          proficiency: lang.proficiency
        })),
        
        accessToken,
        fetchedAt: new Date().toISOString()
      };

      console.log('✅ LinkedIn data processed successfully');
      console.log(`   - ${frontendData.positions.length} positions`);
      console.log(`   - ${frontendData.education.length} education entries`);
      console.log(`   - ${frontendData.skills.length} skills`);
      console.log(`   - ${frontendData.postsCount} posts`);
      console.log(`   - ${frontendData.certifications.length} certifications`);

      // Generate JWT for frontend
      const token = jwt.sign(
        { linkedinId: frontendData.id, email: frontendData.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1h' }
      );

      // Redirect to frontend with token and LinkedIn data
      const redirectUrl = `${FRONTEND_URL}/onboarding?linkedin_token=${token}&linkedin_data=${encodeURIComponent(JSON.stringify(frontendData))}`;
      console.log('✅ Redirecting to frontend...');
      
      res.redirect(redirectUrl);
      
    } catch (error) {
      console.error('❌ Error processing LinkedIn data:', error.message);
      if (error.response) {
        console.error('LinkedIn API Response Status:', error.response.status);
        console.error('LinkedIn API Response Data:', error.response.data);
      }
      res.redirect(`${FRONTEND_URL}/onboarding?error=processing_failed&message=${encodeURIComponent(error.message)}`);
    }
  })(req, res, next);
});

// Save LinkedIn data to user profile
// Save LinkedIn data to user profile (Updated - complete version)
router.post('/save-linkedin', authenticateUser, async (req, res) => {
  try {
    const { linkedinData } = req.body;

    console.log('💾 Saving comprehensive LinkedIn data for user:', req.userId);

    // Save complete LinkedIn data
    const updatedUser = await User.findByIdAndUpdate(
      req.userId,
      {
        linkedinData: {
          ...linkedinData,
          fetchedAt: new Date()
        },
        linkedinConnectedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true, select: '-password -linkedinData.accessToken' }
    );

    console.log('✅ LinkedIn data saved successfully');
    console.log(`   - Name: ${linkedinData.firstName} ${linkedinData.lastName}`);
    console.log(`   - Email: ${linkedinData.email}`);
    console.log(`   - Positions: ${linkedinData.positions?.length || 0}`);
    console.log(`   - Education: ${linkedinData.education?.length || 0}`);
    console.log(`   - Skills: ${linkedinData.skills?.length || 0}`);
    console.log(`   - Certifications: ${linkedinData.certifications?.length || 0}`);

    res.json({ 
      success: true, 
      message: 'LinkedIn data saved successfully',
      summary: {
        name: `${linkedinData.firstName} ${linkedinData.lastName}`,
        email: linkedinData.email,
        positions: linkedinData.positions?.length || 0,
        education: linkedinData.education?.length || 0,
        skills: linkedinData.skills?.length || 0,
        certifications: linkedinData.certifications?.length || 0,
        languages: linkedinData.languages?.length || 0
      }
    });
  } catch (error) {
    console.error('❌ Save LinkedIn error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to save LinkedIn data',
      error: error.message 
    });
  }
});


export default router;