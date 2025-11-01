# ImpactMatch AI Integration Architecture

## System Flow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ImpactMatch Frontend (React)                     │
│                                                                          │
│  SwipePage.jsx                                                          │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ 1. User opens Swipe page                                      │      │
│  │ 2. Calls: GET /api/causes/recommendations                     │      │
│  │ 3. Receives AI-ranked causes                                  │      │
│  │ 4. Displays personalized cause cards                          │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                  ↓                                       │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   ↓
┌──────────────────────────────────┼──────────────────────────────────────┐
│                    ImpactMatch Backend (Node.js/Express)                │
│                                  ↓                                       │
│  causeRoutes.js                                                         │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ GET /api/causes/recommendations                               │      │
│  │ 1. Authenticates user (JWT)                                   │      │
│  │ 2. Fetches user profile from MongoDB                          │      │
│  │ 3. Fetches all active causes from MongoDB                     │      │
│  │ 4. Calls aiMatcher.getAIRecommendations()                     │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                  ↓                                       │
│  aiMatcher.js (utils)                                                   │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ getAIRecommendations(user, causes)                            │      │
│  │ 1. Prepares payload with user features                        │      │
│  │ 2. POST to AI_MODEL_URL/predict                               │      │
│  │ 3. Receives ranked cause IDs with scores                      │      │
│  │ 4. Fallback to rule-based if AI fails                         │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                  ↓                                       │
└──────────────────────────────────┼──────────────────────────────────────┘
                                   ↓ HTTP POST
┌──────────────────────────────────┼──────────────────────────────────────┐
│                      AI Model Service (Flask/Python)                    │
│                      Deployed on Render.com                             │
│                                  ↓                                       │
│  app.py                                                                 │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ POST /predict                                                 │      │
│  │ 1. Receives user features + causes                            │      │
│  │ 2. Loads trained model (model.pkl)                            │      │
│  │ 3. Predicts match scores for each cause                       │      │
│  │ 4. Returns ranked recommendations                             │      │
│  │                                                               │      │
│  │ Response:                                                     │      │
│  │ {                                                             │      │
│  │   "recommendations": [                                        │      │
│  │     {                                                         │      │
│  │       "causeId": "abc123",                                    │      │
│  │       "score": 0.95,                                          │      │
│  │       "reason": "Matches education interest"                  │      │
│  │     }                                                         │      │
│  │   ]                                                           │      │
│  │ }                                                             │      │
│  └──────────────────────────────────────────────────────────────┘      │
│                                                                          │
│  model.pkl (Your trained model from Colab)                              │
│  ┌──────────────────────────────────────────────────────────────┐      │
│  │ • Trained on historical user-cause interactions               │      │
│  │ • Features: interests, skills, location, category             │      │
│  │ • Output: Match probability for each cause                    │      │
│  └──────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
```

## Data Flow Example

### Input (from frontend):
```json
{
  "userId": "user123",
  "interests": ["education", "technology"],
  "skills": ["teaching", "coding"],
  "location": { "lat": 12.9716, "lng": 77.5946 },
  "causes": [
    {
      "id": "cause1",
      "title": "Teach coding to kids",
      "category": "education",
      "ngoId": "ngo1",
      "location": { "lat": 12.9800, "lng": 77.5900 }
    },
    {
      "id": "cause2", 
      "title": "Beach cleanup",
      "category": "environment",
      "ngoId": "ngo2",
      "location": { "lat": 13.0500, "lng": 77.6000 }
    }
  ]
}
```

### AI Model Processing:
```python
# Your model calculates match scores
cause1_score = predict_match(user_features, cause1_features)  # 0.95
cause2_score = predict_match(user_features, cause2_features)  # 0.42

# Ranks by score
recommendations = [
  {"causeId": "cause1", "score": 0.95, "reason": "High match"},
  {"causeId": "cause2", "score": 0.42, "reason": "Low match"}
]
```

### Output (to frontend):
```json
{
  "success": true,
  "recommendations": [
    {
      "_id": "cause1",
      "title": "Teach coding to kids",
      "organization": "Tech For Good NGO",
      "location": "Bangalore",
      "description": "Help kids learn programming",
      "category": "education",
      "aiScore": 95,
      "aiReason": "Matches your education interest and coding skills",
      "aiRecommended": true
    },
    {
      "_id": "cause2",
      "title": "Beach cleanup",
      "organization": "Green Earth NGO",
      "location": "Bangalore", 
      "category": "environment",
      "aiScore": 42,
      "aiReason": "Different category from interests",
      "aiRecommended": true
    }
  ]
}
```

## Fallback Strategy

If AI service is down or slow:

```javascript
// In aiMatcher.js
try {
  // Call AI service
  return await callAIModel(user, causes);
} catch (error) {
  console.log('⚠️ AI unavailable, using fallback');
  
  // Rule-based scoring
  return causes.map(cause => {
    let score = 0.5;
    
    // +0.3 if category matches interests
    if (user.interests.includes(cause.category)) score += 0.3;
    
    // +0.2 if skills match
    const matchingSkills = user.skills.filter(s => 
      cause.requiredSkills.includes(s)
    );
    score += 0.2 * (matchingSkills.length / cause.requiredSkills.length);
    
    // +0.1 if location nearby
    const distance = calculateDistance(user.location, cause.location);
    if (distance < 50) score += 0.1;
    
    return { causeId: cause._id, score };
  });
}
```

## Benefits of This Architecture

✅ **Seamless Fallback**: If AI fails, system still works with rule-based matching  
✅ **Scalable**: AI service can be scaled independently  
✅ **Free Hosting**: Render.com free tier is sufficient for demo  
✅ **Fast Development**: Python ML stack + Node.js backend  
✅ **Easy Updates**: Deploy new model by uploading new .pkl file  
✅ **Monitoring**: Render provides logs and metrics  

## Deployment Checklist

- [ ] Model exported from Colab (`model.pkl`)
- [ ] Flask API customized with your prediction logic
- [ ] Tested locally (`python app.py`)
- [ ] Pushed to GitHub (`git push`)
- [ ] Deployed to Render (Web Service created)
- [ ] Model file uploaded to Render (Secret Files)
- [ ] Environment variable set (`AI_MODEL_URL` in backend)
- [ ] Backend restarted (`npm run dev`)
- [ ] Tested in browser (SwipePage shows AI recommendations)
- [ ] Console logs show: `✅ Got AI recommendations`

## Performance Expectations

| Metric | Target | Notes |
|--------|--------|-------|
| Response Time | < 2s | First request may be slower (cold start) |
| Uptime | 99%+ | Render free tier spins down after 15min idle |
| Concurrent Users | 10-20 | Free tier limit, upgrade for more |
| Model Size | < 500MB | Larger models need paid plan |
| Predictions/min | 100+ | Sufficient for demo/MVP |

## Cost Breakdown

| Service | Free Tier | Paid Option |
|---------|-----------|-------------|
| Render Web Service | 750 hrs/month | $7/month (always on) |
| MongoDB Atlas | 512MB | $9/month (2GB) |
| Vercel/Netlify (frontend) | Unlimited | Free for hobby |
| **Total** | **$0/month** | **$16/month** for production |
