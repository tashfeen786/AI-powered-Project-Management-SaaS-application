import requests
import json
import uuid
import string
import random

BASE_URL = "http://localhost:8000/api/v1"

def random_string(length=8):
    return ''.join(random.choices(string.ascii_lowercase, k=length))

def run_tests():
    print("--- STARTING END-TO-END VERIFICATION ---")
    
    email = f"test_{random_string()}@example.com"
    password = "Password123!"
    
    # 1. Signup
    print("\n[POST] /auth/register")
    res = requests.post(f"{BASE_URL}/auth/register", json={
        "email": email,
        "password": password,
        "full_name": "Test User",
        "organization_name": "Test Org"
    })
    print(f"Status: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    
    # 2. Login
    print("\n[POST] /auth/login")
    res = requests.post(f"{BASE_URL}/auth/login", json={
        "email": email,
        "password": password
    })
    print(f"Status: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    
    token = res.json()["data"]["access_token"]
    headers = {"Authorization": f"Bearer {token}"}
    
    # 3. GET /auth/me
    print("\n[GET] /auth/me")
    res = requests.get(f"{BASE_URL}/auth/me", headers=headers)
    print(f"Status: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    
    # 4. POST /projects
    print("\n[POST] /projects")
    res = requests.post(f"{BASE_URL}/projects", headers=headers, json={
        "name": "My Verification Project",
        "description": "Just verifying!"
    })
    print(f"Status: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    
    # 5. GET /projects
    print("\n[GET] /projects")
    res = requests.get(f"{BASE_URL}/projects", headers=headers)
    print(f"Status: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")
    
    # 6. POST /auth/logout
    print("\n[POST] /auth/logout")
    res = requests.post(f"{BASE_URL}/auth/logout", headers=headers)
    print(f"Status: {res.status_code}")
    print(f"Response: {json.dumps(res.json(), indent=2)}")

if __name__ == "__main__":
    run_tests()
