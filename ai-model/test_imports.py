"""
Quick test to verify the Flask app starts without errors
"""
import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

print("🧪 Testing Flask app imports...")

try:
    from flask import Flask, request, jsonify
    print("✅ Flask imported")
    
    from flask_cors import CORS
    print("✅ Flask-CORS imported")
    
    from transformers import AutoTokenizer, AutoModelForSequenceClassification
    print("✅ Transformers imported")
    
    import torch
    print("✅ PyTorch imported")
    
    import requests
    print("✅ Requests imported")
    
    from bs4 import BeautifulSoup
    print("✅ BeautifulSoup imported")
    
    from duckduckgo_search import DDGS
    print("✅ DuckDuckGo Search imported")
    
    print("\n🎉 All imports successful!")
    print("\n📝 Testing Flask app initialization...")
    
    # Import the app
    from app import app
    print("✅ App imported successfully")
    
    # Test health endpoint
    with app.test_client() as client:
        response = client.get('/health')
        print(f"✅ Health check: {response.status_code} - {response.json}")
    
    print("\n✨ Flask app is ready to run!")
    print("👉 Start with: python app.py")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
