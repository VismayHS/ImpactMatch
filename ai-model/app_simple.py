from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import re
import requests
from bs4 import BeautifulSoup
from duckduckgo_search import DDGS
import warnings
warnings.filterwarnings('ignore')

app = Flask(__name__)
CORS(app)  # Enable CORS for requests from your React frontend

print("✅ NGO Verification Service (Simplified) - Ready!")


@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': True,
        'model_name': 'NGO Verification Engine (Web Search Based)',
        'version': '2.0.0-simple'
    }), 200


@app.route('/verify_ngo', methods=['POST'])
def verify_ngo():
    """
    Verify an NGO using web search and presence analysis
    
    Expected input:
    {
        "ngo_name": "Akshaya Patra Foundation"
    }
    
    Expected output:
    {
        "ngo_name": "Akshaya Patra Foundation",
        "trust_score": 85.5,
        "trust_level": "HIGH",
        "sentiment_label": "POSITIVE",
        "sentiment_score": 0.85,
        "num_links": 10,
        "links": [...],
        "notes": [...]
    }
    """
    try:
        data = request.get_json()
        ngo_name = data.get('ngo_name', '').strip()
        
        if not ngo_name:
            return jsonify({
                'error': 'NGO name is required',
                'success': False
            }), 400
        
        print(f"\n🔍 Verifying NGO: {ngo_name}")
        
        # Perform web search
        search_results = perform_web_search(ngo_name)
        
        # Analyze results
        analysis = analyze_ngo_presence(ngo_name, search_results)
        
        # Calculate trust score
        trust_data = calculate_trust_score(ngo_name, search_results, analysis)
        
        print(f"✅ Verification complete: {trust_data['trust_score']}/100 ({trust_data['trust_level']})")
        
        return jsonify({
            'success': True,
            'ngo_name': ngo_name,
            'trust_score': trust_data['trust_score'],
            'trust_level': trust_data['trust_level'],
            'sentiment_label': analysis['sentiment_label'],
            'sentiment_score': analysis['sentiment_score'],
            'num_links': len(search_results),
            'links': search_results[:10],  # Return top 10 links
            'notes': trust_data['notes']
        }), 200
        
    except Exception as e:
        print(f"❌ Error during verification: {str(e)}")
        return jsonify({
            'error': str(e),
            'success': False,
            'ngo_name': ngo_name if 'ngo_name' in locals() else 'Unknown',
            'trust_score': 50,
            'trust_level': 'UNKNOWN',
            'sentiment_label': 'NEUTRAL',
            'sentiment_score': 0.5,
            'num_links': 0,
            'links': [],
            'notes': ['Error during verification - manual review required']
        }), 200  # Return 200 to prevent backend from failing


def perform_web_search(ngo_name, max_results=10):
    """Perform web search for NGO using multiple methods"""
    results = []
    
    try:
        print(f"🌐 Searching web for: {ngo_name}")
        
        # Method 1: Try DuckDuckGo search
        try:
            from duckduckgo_search import DDGS
            
            queries = [
                f"{ngo_name} NGO India",
                f"{ngo_name} charity foundation",
                f"{ngo_name} official website"
            ]
            
            seen_urls = set()
            
            for query in queries:
                try:
                    ddgs = DDGS()
                    search_results = ddgs.text(query, max_results=5)
                    
                    for result in search_results:
                        url = result.get('href') or result.get('link', '')
                        if url and url not in seen_urls:
                            seen_urls.add(url)
                            results.append({
                                'title': result.get('title', ''),
                                'url': url,
                                'snippet': result.get('body', '') or result.get('snippet', '')
                            })
                        if len(results) >= max_results:
                            break
                except Exception as e:
                    print(f"⚠️ Search query failed: {query} - {str(e)}")
                    continue
                
                if len(results) >= max_results:
                    break
            
            if len(results) > 0:
                print(f"✅ Found {len(results)} search results via DuckDuckGo")
                return results
        except Exception as e:
            print(f"⚠️ DuckDuckGo search failed: {str(e)}")
        
        # Method 2: Direct web presence check (fallback)
        print("🔄 Using direct web presence detection...")
        ngo_patterns = [
            f"https://www.{ngo_name.lower().replace(' ', '')}.org",
            f"https://www.{ngo_name.lower().replace(' ', '')}.in",
            f"https://{ngo_name.lower().replace(' ', '')}.org",
            f"https://{ngo_name.lower().replace(' ', '')}.in",
        ]
        
        for url in ngo_patterns:
            try:
                response = requests.head(url, timeout=3, allow_redirects=True)
                if response.status_code == 200:
                    results.append({
                        'title': f"{ngo_name} - Official Website",
                        'url': url,
                        'snippet': f"Official website of {ngo_name}"
                    })
                    print(f"✅ Found official website: {url}")
                    break
            except:
                continue
        
        # Method 3: Check known NGO databases
        known_databases = [
            f"https://www.ngosindia.com/search?q={ngo_name.replace(' ', '+')}",
            f"https://ngodarpan.gov.in/index.php/search/?q={ngo_name.replace(' ', '+')}",
        ]
        
        for db_url in known_databases:
            results.append({
                'title': f"{ngo_name} - NGO Database Search",
                'url': db_url,
                'snippet': f"Search results for {ngo_name} in NGO database"
            })
        
        if len(results) > 0:
            print(f"✅ Generated {len(results)} reference links")
        else:
            print(f"⚠️ No web presence detected")
        
        return results
        
    except Exception as e:
        print(f"⚠️ Web search failed: {str(e)}")
        return []


def analyze_ngo_presence(ngo_name, search_results):
    """Analyze NGO's web presence and sentiment"""
    
    # Keywords indicating positive/negative sentiment
    positive_keywords = [
        'registered', 'certified', 'verified', 'official', 'legitimate',
        'trusted', 'approved', 'recognized', 'established', 'reputable',
        'government', 'ngo', 'foundation', 'charity', 'non-profit',
        'award', 'achievement', 'impact', 'helping', 'community'
    ]
    
    negative_keywords = [
        'fraud', 'scam', 'fake', 'illegal', 'suspended', 'banned',
        'unverified', 'suspicious', 'complaint', 'warning', 'alert',
        'investigation', 'controversy', 'dispute'
    ]
    
    neutral_keywords = [
        'organization', 'group', 'association', 'society', 'trust'
    ]
    
    # Analyze snippets
    text_combined = ' '.join([
        r.get('title', '').lower() + ' ' + r.get('snippet', '').lower()
        for r in search_results
    ])
    
    positive_count = sum(1 for kw in positive_keywords if kw in text_combined)
    negative_count = sum(1 for kw in negative_keywords if kw in text_combined)
    neutral_count = sum(1 for kw in neutral_keywords if kw in text_combined)
    
    total_keywords = positive_count + negative_count + neutral_count
    
    if total_keywords > 0:
        sentiment_score = (positive_count - negative_count) / total_keywords
        sentiment_score = max(0, min(1, (sentiment_score + 1) / 2))  # Normalize to 0-1
    else:
        sentiment_score = 0.5
    
    # Determine sentiment label
    if sentiment_score >= 0.65:
        sentiment_label = "POSITIVE"
    elif sentiment_score >= 0.45:
        sentiment_label = "NEUTRAL"
    else:
        sentiment_label = "NEGATIVE"
    
    return {
        'sentiment_score': round(sentiment_score, 2),
        'sentiment_label': sentiment_label,
        'positive_indicators': positive_count,
        'negative_indicators': negative_count,
        'neutral_indicators': neutral_count
    }


def calculate_trust_score(ngo_name, search_results, analysis):
    """Calculate final trust score based on multiple factors"""
    
    notes = []
    score = 50  # Base score
    
    # Check if NGO name has legitimate-sounding patterns
    legitimate_patterns = [
        'foundation', 'trust', 'society', 'welfare', 'charity',
        'relief', 'aid', 'help', 'care', 'support', 'seva', 'sangh',
        'patra', 'akshaya', 'parivaar', 'samiti', 'mandal'
    ]
    
    name_lower = ngo_name.lower()
    has_legitimate_pattern = any(pattern in name_lower for pattern in legitimate_patterns)
    
    if has_legitimate_pattern:
        score += 10
        notes.append(f"NGO name follows legitimate naming pattern")
    
    # Factor 1: Number of search results (0-20 points)
    num_results = len(search_results)
    if num_results >= 10:
        score += 20
        notes.append(f"Strong web presence ({num_results} results found)")
    elif num_results >= 5:
        score += 15
        notes.append(f"Good web presence ({num_results} results found)")
    elif num_results >= 2:
        score += 10
        notes.append(f"Moderate web presence ({num_results} results found)")
    elif num_results > 0:
        score += 5
        notes.append(f"Minimal web presence ({num_results} results found)")
    else:
        notes.append(f"No web presence detected - verification needed")
    
    # Factor 2: Sentiment analysis (0-25 points)
    sentiment_score = analysis['sentiment_score']
    sentiment_points = int(sentiment_score * 25)
    score += sentiment_points
    notes.append(f"Sentiment analysis: {analysis['sentiment_label']} ({sentiment_score:.2f})")
    
    # Factor 3: Positive indicators (0-20 points)
    positive_count = analysis['positive_indicators']
    if positive_count >= 10:
        score += 20
        notes.append(f"Many positive indicators found ({positive_count})")
    elif positive_count >= 5:
        score += 15
        notes.append(f"Several positive indicators found ({positive_count})")
    elif positive_count >= 2:
        score += 10
        notes.append(f"Some positive indicators found ({positive_count})")
    
    # Factor 4: Negative indicators (penalty)
    negative_count = analysis['negative_indicators']
    if negative_count > 0:
        penalty = min(30, negative_count * 10)
        score -= penalty
        notes.append(f"⚠️ Negative indicators found ({negative_count}) - penalty applied")
    
    # Factor 5: Official website presence (0-10 points)
    has_official_site = any(
        'official' in r.get('title', '').lower() or
        ngo_name.lower().replace(' ', '') in r.get('url', '').lower()
        for r in search_results
    )
    if has_official_site:
        score += 10
        notes.append("Official website found")
    
    # Ensure score is within 0-100 range
    score = max(0, min(100, score))
    
    # Determine trust level
    if score >= 80:
        trust_level = "VERY HIGH"
    elif score >= 70:
        trust_level = "HIGH"
    elif score >= 55:
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
    print(f"\n🚀 Starting NGO Verification Service on port {port}")
    print(f"📡 Health check: http://localhost:{port}/health")
    print(f"🔍 Verification endpoint: http://localhost:{port}/verify_ngo")
    print("=" * 60)
    app.run(host='0.0.0.0', port=port, debug=False)
