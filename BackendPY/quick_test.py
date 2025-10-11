#!/usr/bin/env python3
"""
Prosty test API - uruchamia się w osobnym procesie
"""
import requests
import json
import sys
import time

def test_basic():
    """Test podstawowych funkcji API"""
    base_url = "http://localhost:8000"
    
    print("🚀 Testowanie API...")
    
    try:
        # Test 1: Sprawdź czy serwer działa
        print("\n1. Test połączenia...")
        response = requests.get(f"{base_url}/")
        print(f"Status: {response.status_code}")
        print(f"Response: {response.json()}")
        
        if response.status_code != 200:
            print("❌ Serwer nie odpowiada")
            return False
            
        print("✅ Serwer działa")
        
        # Test 2: Rejestracja użytkownika
        print("\n2. Test rejestracji...")
        user_data = {
            "login": "testuser456",
            "password": "testpass123",
            "first_name": "Anna",
            "last_name": "Kowalska"
        }
        
        response = requests.post(f"{base_url}/register", json=user_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ Rejestracja OK")
            print(f"User ID: {result.get('user_id')}")
            user_id = result.get('user_id')
            
            # Test 3: Logowanie
            print("\n3. Test logowania...")
            login_data = {
                "login": "testuser456",
                "password": "testpass123"
            }
            response = requests.post(f"{base_url}/login", json=login_data)
            print(f"Status: {response.status_code}")
            if response.status_code == 200:
                print("✅ Logowanie OK")
            else:
                print("❌ Błąd logowania")
                
            # Test 4: Pobranie danych użytkownika
            if user_id:
                print(f"\n4. Test pobrania danych użytkownika...")
                response = requests.get(f"{base_url}/users/{user_id}")
                print(f"Status: {response.status_code}")
                if response.status_code == 200:
                    print("✅ Pobranie danych OK")
                    print(f"Dane: {response.json()}")
                else:
                    print("❌ Błąd pobrania danych")
                    
        else:
            print(f"❌ Błąd rejestracji: {response.text}")
            
        # Test 5: Generowanie tokenu
        print("\n5. Test generowania tokenu...")
        form_data = {
            "data": {
                "name": "Test User",
                "email": "test@example.com",
                "age": 25
            }
        }
        
        response = requests.post(f"{base_url}/generateToken", json=form_data)
        print(f"Status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Generowanie tokenu OK")
            encrypted_token = result.get('encrypted_token')
            qr_data = result.get('qr_data')
            print(f"Token: {encrypted_token[:50]}...")
            print(f"QR Data: {qr_data[:50]}...")
            
            # Test 6: Dekryptowanie tokenu
            if encrypted_token:
                print("\n6. Test dekryptowania tokenu...")
                decrypt_data = {
                    "encrypted_token": encrypted_token
                }
                response = requests.post(f"{base_url}/decryptToken", json=decrypt_data)
                print(f"Status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    print("✅ Dekryptowanie OK")
                    print(f"Odzyskane dane: {json.dumps(result, indent=2)}")
                else:
                    print(f"❌ Błąd dekryptowania: {response.text}")
        else:
            print(f"❌ Błąd generowania tokenu: {response.text}")
            
        print("\n🎉 Testy zakończone!")
        return True
        
    except requests.exceptions.ConnectionError:
        print("❌ Nie można połączyć się z serwerem na http://localhost:8000")
        print("Upewnij się, że serwer działa!")
        return False
    except Exception as e:
        print(f"❌ Błąd: {e}")
        return False

if __name__ == "__main__":
    success = test_basic()
    sys.exit(0 if success else 1)