const express = require('express');
const router = express.Router();
const Cause = require('../models/Cause');
const natural = require('natural');

// POST /api/chat/suggest
// Get cause suggestions based on chat query
router.post('/suggest', async (req, res) => {
  try {
    const { query, userId } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'query is required' });
    }

    // Get all causes
    const causes = await Cause.find({});

    if (causes.length === 0) {
      return res.json({ suggestions: [] });
    }

    // TF-IDF matching against query
    const tfidf = new natural.TfIdf();

    // Add query as document 0
    tfidf.addDocument(query.toLowerCase());

    // Add each cause as a document
    causes.forEach((cause) => {
      const text = `${cause.name} ${cause.description} ${cause.category} ${cause.city}`.toLowerCase();
      tfidf.addDocument(text);
    });

    // Calculate similarity scores
    const suggestions = [];
    causes.forEach((cause, index) => {
      let similarity = 0;
      tfidf.tfidfs(query.toLowerCase(), (i, measure) => {
        if (i === index + 1) {
          // +1 because query is at index 0
          similarity = measure;
        }
      });

      if (similarity > 0) {
        // Only include relevant results
        suggestions.push({
          id: cause._id,
          name: cause.name,
          description: cause.description,
          category: cause.category,
          city: cause.city,
          similarity: Math.min(similarity * 100, 100).toFixed(2),
        });
      }
    });

    // Sort by similarity and return top 5
    suggestions.sort((a, b) => parseFloat(b.similarity) - parseFloat(a.similarity));
    const topSuggestions = suggestions.slice(0, 5);

    res.json({
      query,
      suggestions: topSuggestions,
      message: topSuggestions.length > 0 ? `I found ${topSuggestions.length} causes that might interest you!` : "I couldn't find any matching causes. Try a different search!",
    });
  } catch (error) {
    console.error('Chat suggest error:', error);
    res.status(500).json({ error: 'Failed to get suggestions' });
  }
});

module.exports = router;
