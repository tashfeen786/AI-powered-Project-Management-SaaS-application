import requests
print("Requesting GET /api/v1/tasks")
response = requests.get("http://127.0.0.1:8000/api/v1/tasks")
print("Status:", response.status_code)
print("Response:", response.text)
