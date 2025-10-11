@echo off
echo Testing API endpoints...

echo.
echo 1. Testing basic endpoint...
curl -X GET http://localhost:8000/ -H "Accept: application/json"

echo.
echo.
echo 2. Testing user registration...
curl -X POST http://localhost:8000/register ^
  -H "Content-Type: application/json" ^
  -d "{\"login\": \"testuser001\", \"password\": \"testpass123\", \"first_name\": \"Anna\", \"last_name\": \"Kowalska\"}"

echo.
echo.
echo 3. Testing token generation...
curl -X POST http://localhost:8000/generateToken ^
  -H "Content-Type: application/json" ^
  -d "{\"data\": {\"name\": \"Test User\", \"age\": 30, \"city\": \"Warsaw\"}}"

echo.
echo Done!