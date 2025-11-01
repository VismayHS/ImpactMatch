const axios = require('axios');

// AI Model URL - NGO Verification Engine
const AI_MODEL_URL = process.env.AI_MODEL_URL || 'http://localhost:8000';

/**
 * Verify NGO authenticity using AI
 * @param {String} ngoName - Name of the NGO to verify
 * @returns {Promise<Object>} - Verification result with trust score
 */
async function verifyNGO(ngoName) {
  try {
    console.log(`🔍 Calling AI verification for: ${ngoName}`);
    
    const response = await axios.post(
      `${AI_MODEL_URL}/verify_ngo`,
      { ngo_name: ngoName },
      {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000 // 30 second timeout for web scraping
      }
    );

    if (response.data) {
      console.log(`✅ AI Verification: ${response.data.trust_score}/100 (${response.data.trust_level})`);
      return {
        success: true,
        trustScore: response.data.trust_score,
        trustLevel: response.data.trust_level,
        sentimentLabel: response.data.sentiment_label,
        sentimentScore: response.data.sentiment_score,
        numLinks: response.data.num_links,
        links: response.data.links,
        notes: response.data.notes,
        verified: response.data.trust_score >= 60
      };
    } else {
      throw new Error('Invalid AI response');
    }

  } catch (error) {
    console.error('❌ AI verification error:', error.message);
    
    // Return fallback response
    return {
      success: false,
      trustScore: 50,
      trustLevel: 'UNKNOWN',
      sentimentLabel: 'NEUTRAL',
      sentimentScore: 0.5,
      numLinks: 0,
      links: [],
      notes: ['AI service unavailable - manual verification required'],
      verified: false,
      requiresManualReview: true,
      error: error.message
    };
  }
}

/**
 * Health check for AI service
 */
async function checkAIServiceHealth() {
  try {
    const response = await axios.get(`${AI_MODEL_URL}/health`, { timeout: 5000 });
    return {
      healthy: response.data.status === 'healthy',
      modelLoaded: response.data.model_loaded,
      modelName: response.data.model_name,
      version: response.data.version
    };
  } catch (error) {
    return {
      healthy: false,
      error: error.message
    };
  }
}

module.exports = {
  verifyNGO,
  checkAIServiceHealth
};
