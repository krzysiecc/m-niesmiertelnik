import requests
import json

def test_register():
    user_data = {
        "login": "testuser789",
        "password": "testpass123",
        "first_name": "Jan",
        "last_name": "Kowalski"
    }
    
    try:
        response = requests.post("http://localhost:8000/register", json=user_data)
        print(f"Status: {response.status_code}")
        print(f"Headers: {response.headers}")
        print(f"Text: {response.text}")
        
        if response.status_code == 200:
            print("✅ Success")
            print(json.dumps(response.json(), indent=2))
        else:
            print("❌ Error")
            
    except Exception as e:
        print(f"Exception: {e}")

if __name__ == "__main__":
    test_register()