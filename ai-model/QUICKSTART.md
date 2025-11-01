# Quick Start: Integrate Your Colab Model

## 1️⃣ Export from Colab (2 minutes)

```python
import pickle
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

from google.colab import files
files.download('model.pkl')
```

## 2️⃣ Customize Flask API (5 minutes)

Edit `ai-model/app.py` at line 60:

```python
# Replace this section with your actual prediction code
if model is None:
    # REPLACE THIS ENTIRE BLOCK
    recommendations = your_model_prediction_logic(user, causes)
```

## 3️⃣ Test Locally (2 minutes)

```powershell
cd ai-model
pip install -r requirements.txt
# Copy model.pkl here
python app.py

# Test: 
curl http://localhost:5000/health
```

## 4️⃣ Deploy to Render (10 minutes)

1. Push to GitHub:
```powershell
git add ai-model/
git commit -m "Add AI model"
git push
```

2. Go to https://render.com → New Web Service
3. Select repo, root dir: `ai-model`
4. Upload `model.pkl` in Environment → Secret Files
5. Copy the URL (e.g., `https://your-app.onrender.com`)

## 5️⃣ Connect to ImpactMatch (1 minute)

Create `impactmatch/.env`:
```
AI_MODEL_URL=https://your-app.onrender.com
```

Restart backend:
```powershell
cd impactmatch
npm run dev
```

## ✅ Verify It Works

1. Login to ImpactMatch
2. Go to Swipe page
3. Open Console (F12)
4. Look for: `✅ Got AI recommendations: 20`

---

## 🆘 Common Issues

**"Model not loaded"** → Upload model.pkl to Render  
**"Timeout"** → Increase timeout in `aiMatcher.js` line 38  
**"500 error"** → Check Render logs for Python errors  
**"Using fallback"** → AI service is down, still works with basic matching  

---

## 📝 What You Need to Tell Me

To customize the Flask API for your specific model:

1. **What does it predict?**
   - User-cause match scores?
   - Cause rankings?
   - Category preferences?

2. **What inputs does it need?**
   ```python
   # Example
   features = [
       user['age'],
       user['location'],
       encode_interests(user['interests']),
       # ... what else?
   ]
   ```

3. **What's the output format?**
   ```python
   # Example
   predictions = model.predict(features)
   # predictions = [0.9, 0.7, 0.5, ...]  # Scores for each cause?
   ```

4. **What library?**
   - [ ] scikit-learn (RandomForest, SVM, etc.)
   - [ ] TensorFlow/Keras
   - [ ] PyTorch
   - [ ] Custom/Other

Share these details and I'll write the exact code for you!
