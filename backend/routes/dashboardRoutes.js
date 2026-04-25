const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Get dashboard stats for current user
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const supabase = req.supabase;

    console.log('[Dashboard Stats] Fetching stats for user:', userId);

    // Get counts from Supabase in parallel
    const [jobsResult, helpResult, visionsResult] = await Promise.all([
      supabase
        .from('job_posts')
        .select('*', { count: 'exact', head: true })
        .eq('posted_by', userId),
      supabase
        .from('help_requests')
        .select('*', { count: 'exact', head: true })
        .eq('created_by', userId),
      supabase
        .from('vision_ideas')
        .select('*', { count: 'exact', head: true })
        .eq('proposed_by', userId)
    ]);

    // Check for errors
    if (jobsResult.error) {
      console.error('[Dashboard Stats] Jobs count error:', jobsResult.error);
    }
    if (helpResult.error) {
      console.error('[Dashboard Stats] Help requests count error:', helpResult.error);
    }
    if (visionsResult.error) {
      console.error('[Dashboard Stats] Vision ideas count error:', visionsResult.error);
    }

    res.json({
      success: true,
      data: {
        jobPosts: jobsResult.count || 0,
        helpRequests: helpResult.count || 0,
        visionIdeas: visionsResult.count || 0
      }
    });
  } catch (error) {
    console.error('[Dashboard Stats] Error:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

module.exports = router;
