import express from 'express';
import { Retell } from 'retell-sdk';

const router = express.Router();

// DON'T initialize here - do it inside route handlers
// This ensures env vars are loaded first

// Helper function to get Retell client
function getRetellClient() {
  const apiKey = process.env.RETELL_API_KEY;
  
  if (!apiKey) {
    console.error('❌ RETELL_API_KEY not found!');
    throw new Error('RETELL_API_KEY not configured');
  }
  
  return new Retell({ apiKey });
}

// Create web call
router.post('/create-call', async (req, res) => {
  try {
    const { candidateName, roomId } = req.body;

    console.log('📞 Creating Retell call for:', candidateName);
    
    // Create client here (after env is loaded)
    const retellClient = getRetellClient();

    const call = await retellClient.call.createWebCall({
      agent_id: process.env.RETELL_AGENT_ID,
      metadata: {
        candidate_name: candidateName,
        room_id: roomId,
        platform: 'SkillSphere'
      },
      retell_llm_dynamic_variables: {
        candidate_name: candidateName
      }
    });

    console.log('✅ Call created:', call.call_id);

    res.json({
      success: true,
      accessToken: call.access_token,
      callId: call.call_id
    });

  } catch (error) {
    console.error('❌ Retell Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to create call',
      details: error.message 
    });
  }
});

// Get call details
router.get('/call/:callId', async (req, res) => {
  try {
    const { callId } = req.params;
    
    const retellClient = getRetellClient();
    const call = await retellClient.call.retrieve(callId);
    
    res.json({
      success: true,
      call: call,
      transcript: call.transcript,
      recording_url: call.recording_url
    });

  } catch (error) {
    console.error('❌ Get call error:', error.message);
    res.status(500).json({ 
      error: 'Failed to retrieve call',
      details: error.message 
    });
  }
});

export default router;
