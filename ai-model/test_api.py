"""
Test script for AI Model API
Run this to verify your Flask API is working correctly
"""

import requests
import json

# Change this to your deployed URL after deployment
API_URL = "http://localhost:5000"

def test_health():
    """Test the health endpoint"""
    print("\n🏥 Testing health endpoint...")
    try:
        response = requests.get(f"{API_URL}/health", timeout=5)
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code == 200 and response.json().get('status') == 'healthy':
            print("✅ Health check passed!")
            return True
        else:
            print("❌ Health check failed!")
            return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_prediction():
    """Test the prediction endpoint"""
    print("\n🤖 Testing prediction endpoint...")
    
    # Sample test data
    test_data = {
        "userId": "test_user_123",
        "interests": ["education", "technology"],
        "skills": ["teaching", "coding", "communication"],
        "location": {
            "lat": 12.9716,
            "lng": 77.5946
        },
        "causes": [
            {
                "id": "cause_001",
                "title": "Teach coding to underprivileged kids",
                "category": "education",
                "ngoId": "ngo_tech",
                "location": {"lat": 12.9800, "lng": 77.5900},
                "requiredSkills": ["teaching", "coding"],
                "description": "Help kids learn programming",
                "impactArea": "digital_literacy"
            },
            {
                "id": "cause_002",
                "title": "Beach cleanup drive",
                "category": "environment",
                "ngoId": "ngo_green",
                "location": {"lat": 13.0500, "lng": 77.6000},
                "requiredSkills": ["teamwork"],
                "description": "Clean up beaches",
                "impactArea": "environmental_conservation"
            },
            {
                "id": "cause_003",
                "title": "Digital literacy workshop for seniors",
                "category": "education",
                "ngoId": "ngo_seniors",
                "location": {"lat": 12.9650, "lng": 77.5800},
                "requiredSkills": ["teaching", "technology"],
                "description": "Teach seniors to use smartphones",
                "impactArea": "digital_literacy"
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json=test_data,
            headers={"Content-Type": "application/json"},
            timeout=10
        )
        
        print(f"Status: {response.status_code}")
        print(f"Response: {json.dumps(response.json(), indent=2)}")
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and data.get('recommendations'):
                recs = data['recommendations']
                print(f"\n✅ Got {len(recs)} recommendations!")
                
                # Verify recommendations are sorted by score
                scores = [r['score'] for r in recs]
                if scores == sorted(scores, reverse=True):
                    print("✅ Recommendations are properly sorted by score!")
                else:
                    print("⚠️ Recommendations not sorted by score")
                
                # Show top recommendation
                if recs:
                    top = recs[0]
                    print(f"\n🏆 Top Recommendation:")
                    print(f"   Cause ID: {top['causeId']}")
                    print(f"   Score: {top['score']:.2f}")
                    print(f"   Reason: {top.get('reason', 'N/A')}")
                
                return True
            else:
                print("❌ Invalid response format!")
                return False
        else:
            print(f"❌ Request failed with status {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def test_edge_cases():
    """Test edge cases"""
    print("\n🔍 Testing edge cases...")
    
    # Test with empty causes
    print("\n1. Testing with no causes...")
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json={
                "userId": "test",
                "interests": ["education"],
                "skills": [],
                "causes": []
            },
            timeout=5
        )
        
        if response.status_code == 400:
            print("✅ Correctly handles empty causes")
        else:
            print(f"⚠️ Unexpected response: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")
    
    # Test with missing data
    print("\n2. Testing with missing data...")
    try:
        response = requests.post(
            f"{API_URL}/predict",
            json={},
            timeout=5
        )
        
        if response.status_code == 400:
            print("✅ Correctly handles missing data")
        else:
            print(f"⚠️ Unexpected response: {response.status_code}")
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    print("=" * 60)
    print("🧪 AI Model API Test Suite")
    print("=" * 60)
    print(f"Testing URL: {API_URL}")
    
    # Run tests
    health_ok = test_health()
    
    if health_ok:
        prediction_ok = test_prediction()
        test_edge_cases()
        
        print("\n" + "=" * 60)
        if health_ok and prediction_ok:
            print("✅ ALL TESTS PASSED!")
            print("\nYour AI model API is working correctly!")
            print("\nNext steps:")
            print("1. Deploy to Render.com")
            print("2. Update AI_MODEL_URL in your backend .env")
            print("3. Test in ImpactMatch app")
        else:
            print("❌ SOME TESTS FAILED")
            print("\nCheck the errors above and fix them.")
    else:
        print("\n❌ Health check failed - make sure the server is running!")
        print("\nRun: python app.py")
    
    print("=" * 60)

if __name__ == "__main__":
    main()
