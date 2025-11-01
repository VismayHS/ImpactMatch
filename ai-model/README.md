# ImpactMatch AI Model API

Flask API for serving cause recommendation predictions.

## Local Development

1. **Install dependencies:**
```bash
pip install -r requirements.txt
```

2. **Add your trained model:**
   - Export your model from Google Colab as `model.pkl`
   - Place it in this directory

3. **Run the API:**
```bash
python app.py
```

The API will be available at `http://localhost:5000`

## Testing the API

```bash
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test123",
    "interests": ["education"],
    "skills": ["teaching"],
    "causes": [
      {"id": "cause1", "category": "education", "title": "Teach Kids"}
    ]
  }'
```

## Deployment to Render

1. **Push this folder to GitHub** (in the `ai-model/` directory)

2. **Create Render account** at https://render.com

3. **Deploy:**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Render will auto-detect the `render.yaml` config
   - Click "Create Web Service"

4. **Upload your model:**
   - Go to your service dashboard
   - Navigate to "Environment" → "Files"
   - Upload your `model.pkl` file

5. **Get your API URL:**
   - Copy the URL (e.g., `https://impactmatch-ai.onrender.com`)
   - Add it to your Node.js backend as `AI_MODEL_URL`

## Environment Variables

- `PORT`: Server port (default: 5000)
- `MODEL_PATH`: Path to the model file (default: model.pkl)

## API Endpoints

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

### `POST /predict`
Get cause recommendations for a user

**Request:**
```json
{
  "userId": "user123",
  "interests": ["education", "health"],
  "skills": ["teaching", "communication"],
  "location": {
    "lat": 12.9716,
    "lng": 77.5946
  },
  "causes": [...]
}
```

**Response:**
```json
{
  "success": true,
  "recommendations": [
    {
      "causeId": "cause_id",
      "score": 0.95,
      "reason": "Matches your interests"
    }
  ]
}
```

## Exporting Model from Google Colab

Add this to your Colab notebook:

```python
import pickle

# After training your model
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)

# Download the file
from google.colab import files
files.download('model.pkl')
```
