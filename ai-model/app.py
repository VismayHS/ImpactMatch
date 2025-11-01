from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Enable CORS for requests from your React frontend

# Load HuggingFace sentiment analysis model
print("🔄 Loading sentiment analysis model...")
try:
    MODEL_NAME = "cardiffnlp/twitter-roberta-base-sentiment-latest"
    tokenizer = AutoTokenizer.from_pretrained(MODEL_NAME)
    sentiment_model = AutoModelForSequenceClassification.from_pretrained(MODEL_NAME)
    print("✅ Sentiment model loaded successfully!")
except Exception as e:
    print(f"⚠️ Model loading error: {e}")
    tokenizer = None
    sentiment_model = None


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': sentiment_model is not None,
        'model_name': 'NGO Verification Engine (Sentiment + Web Search)',
        'version': '1.0.0'
    }), 200


@app.route('/verify_ngo', methods=['POST'])
def verify_ngo():
    """
    Verify an NGO using sentiment analysis and web presence
    
    Expected input:
    {
        "ngo_name": "Akshaya Patra Foundation"
    }
    
    Expected output:
    {
        "ngo_name": "Akshaya Patra Foundation",
        "sentiment_label": "POSITIVE",
        "sentiment_score": 0.92,
        "num_links": 5,
        "links": [...],
        "trust_score": 91.6,
        "trust_level": "HIGH",
        "notes": [...]
    }
    """
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'No data provided'}), 400
        
        ngo_name = data.get('ngo_name', '').strip()
        
        if not ngo_name:
            return jsonify({'error': 'NGO name is required'}), 400
        
        print(f"🔍 Verifying NGO: {ngo_name}")
        
        # Step 1: Search the web for NGO
        links = search_ngo(ngo_name)
        print(f"📄 Found {len(links)} links")
        
        # Step 2: Scrape content from links
        text_content = scrape_links(links, max_links=5)
        print(f"📝 Scraped {len(text_content)} characters of text")
        
        # Step 3: Perform sentiment analysis
        sentiment_result = analyze_sentiment(text_content)
        print(f"💭 Sentiment: {sentiment_result['label']} ({sentiment_result['score']:.2f})")
        
        # Step 4: Calculate trust score
        trust_data = calculate_trust_score(
            ngo_name, 
            sentiment_result, 
            links, 
            len(text_content)
        )
        
        print(f"✅ Trust Score: {trust_data['trust_score']:.1f}/100 ({trust_data['trust_level']})")
        
        # Combine all results
        result = {
            'ngo_name': ngo_name,
            'sentiment_label': sentiment_result['label'],
            'sentiment_score': sentiment_result['score'],
            'num_links': len(links),
            'links': links[:5],  # Return top 5 links
            **trust_data
        }
        
        return jsonify(result), 200
        
    except Exception as e:
        print(f"❌ Error verifying NGO: {str(e)}")
        return jsonify({
            'error': str(e),
            'ngo_name': data.get('ngo_name', 'Unknown'),
            'trust_score': 0,
            'trust_level': 'ERROR'
        }), 500


def search_ngo(ngo_name, max_results=10):
    """Search for NGO using DuckDuckGo"""
    try:
        ddgs = DDGS()
        results = ddgs.text(f"{ngo_name} NGO official", max_results=max_results)
        links = [r['href'] for r in results if 'href' in r]
        return links
    except Exception as e:
        print(f"⚠️ Search error: {e}")
        return []


def scrape_links(links, max_links=5):
    """Scrape text content from NGO links"""
    all_text = ""
    
    for link in links[:max_links]:
        try:
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
            response = requests.get(link, headers=headers, timeout=5)
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Get text and clean it
            text = soup.get_text()
            lines = (line.strip() for line in text.splitlines())
            chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
            text = ' '.join(chunk for chunk in chunks if chunk)
            
            all_text += text[:1000] + " "  # Take first 1000 chars from each page
            
        except Exception as e:
            print(f"⚠️ Scraping error for {link}: {e}")
            continue
    
    return all_text[:5000]  # Limit total text to 5000 chars


def analyze_sentiment(text):
    """Analyze sentiment using HuggingFace model"""
    if not text or sentiment_model is None or tokenizer is None:
        return {'label': 'NEUTRAL', 'score': 0.5}
    
    try:
        # Truncate text to model's max length
        inputs = tokenizer(text, return_tensors="pt", truncation=True, max_length=512)
        
        with torch.no_grad():
            outputs = sentiment_model(**inputs)
        
        # Get prediction
        scores = torch.nn.functional.softmax(outputs.logits, dim=-1)
        prediction = torch.argmax(scores, dim=-1).item()
        confidence = scores[0][prediction].item()
        
        # Map to labels (model outputs: negative=0, neutral=1, positive=2)
        labels = ['NEGATIVE', 'NEUTRAL', 'POSITIVE']
        
        return {
            'label': labels[prediction],
            'score': confidence
        }
        
    except Exception as e:
        print(f"⚠️ Sentiment analysis error: {e}")
        return {'label': 'NEUTRAL', 'score': 0.5}


def calculate_trust_score(ngo_name, sentiment_result, links, text_length):
    """Calculate trust score based on multiple factors"""
    score = 50  # Base score
    notes = []
    
    # Factor 1: Sentiment (0-30 points)
    if sentiment_result['label'] == 'POSITIVE':
        sentiment_boost = sentiment_result['score'] * 30
        score += sentiment_boost
        notes.append(f"Positive sentiment increased trust (+{sentiment_boost:.1f})")
    elif sentiment_result['label'] == 'NEGATIVE':
        sentiment_penalty = sentiment_result['score'] * 20
        score -= sentiment_penalty
        notes.append(f"Negative sentiment decreased trust (-{sentiment_penalty:.1f})")
    else:
        notes.append("Neutral sentiment (no change)")
    
    # Factor 2: Number of links found (0-20 points)
    if len(links) >= 5:
        score += 20
        notes.append("Strong web presence (5+ links)")
    elif len(links) >= 3:
        score += 10
        notes.append("Moderate web presence (3-4 links)")
    elif len(links) >= 1:
        score += 5
        notes.append("Limited web presence (1-2 links)")
    else:
        score -= 10
        notes.append("No web presence found")
    
    # Factor 3: Wikipedia presence (0-15 points)
    has_wikipedia = any('wikipedia.org' in link for link in links)
    if has_wikipedia:
        score += 15
        notes.append("Found Wikipedia page (+15)")
    
    # Factor 4: Official domain (.org, .gov) (0-10 points)
    has_org_domain = any(re.search(r'\.(org|gov)', link) for link in links)
    if has_org_domain:
        score += 10
        notes.append("Found .org/.gov domain(s) (+10)")
    
    # Factor 5: Content length (0-5 points)
    if text_length > 3000:
        score += 5
        notes.append("Rich content available (+5)")
    elif text_length < 500:
        score -= 5
        notes.append("Limited content found (-5)")
    
    # Clamp score to 0-100
    score = max(0, min(100, score))
    
    # Determine trust level
    if score >= 80:
        trust_level = "HIGH"
    elif score >= 60:
        trust_level = "MEDIUM"
    elif score >= 40:
        trust_level = "LOW"
    else:
        trust_level = "VERY LOW"
    
    return {
        'trust_score': round(score, 1),
        'trust_level': trust_level,
        'notes': notes
    }


if __name__ == '__main__':
    port = int(os.getenv('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=False)
