import requests
import json
import time

# Bazowy URL API
BASE_URL = "http://localhost:8000"

def test_endpoint(method, endpoint, data=None, expected_status=200):
    """Testuje endpoint i zwraca wynik"""
    url = f"{BASE_URL}{endpoint}"
    try:
        if method == "GET":
            response = requests.get(url)
        elif method == "POST":
            response = requests.post(url, json=data)
        
        print(f"\n{method} {endpoint}")
        print(f"Status: {response.status_code}")
        
        if response.status_code == expected_status:
            print("✅ PASS")
        else:
            print("❌ FAIL")
            
        try:
            result = response.json()
            print(f"Response: {json.dumps(result, indent=2)}")
            return result
        except:
            print(f"Raw response: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ ERROR: {e}")
        return None

def main():
    print("🚀 Testowanie API...")
    
    # Test 1: Podstawowy endpoint
    test_endpoint("GET", "/")
    
    # Test 2: Rejestracja użytkownika
    user_data = {
        "login": "testuser123",
        "password": "testpassword123",
        "first_name": "Jan",
        "last_name": "Kowalski"
    }
    register_result = test_endpoint("POST", "/register", user_data)
    
    if register_result:
        user_id = register_result.get("user_id")
        print(f"\n📝 Zapisany user_id: {user_id}")
        
        # Test 3: Logowanie
        login_data = {
            "login": "testuser123",
            "password": "testpassword123"
        }
        test_endpoint("POST", "/login", login_data)
        
        # Test 4: Pobranie danych użytkownika
        if user_id:
            test_endpoint("GET", f"/users/{user_id}")
            
            # Test 5: Aktualizacja profilu
            update_data = {
                "first_name": "Janusz",
                "last_name": "Nowak"
            }
            test_endpoint("POST", f"/users/{user_id}/update", update_data)
            
            # Test 6: Generowanie nowego ID
            test_endpoint("POST", f"/users/{user_id}/new_id")
    
    # Test 7: Generowanie tokenu
    form_data = {
        "data": {
            "name": "Jan Kowalski",
            "age": 30,
            "city": "Warszawa",
            "profession": "Developer"
        }
    }
    token_result = test_endpoint("POST", "/generateToken", form_data)
    
    if token_result:
        encrypted_token = token_result.get("encrypted_token")
        print(f"\n🔐 Wygenerowany token: {encrypted_token[:50]}...")
        
        # Test 8: Dekryptowanie tokenu
        if encrypted_token:
            decrypt_data = {
                "encrypted_token": encrypted_token
            }
            test_endpoint("POST", "/decryptToken", decrypt_data)

if __name__ == "__main__":
    main()