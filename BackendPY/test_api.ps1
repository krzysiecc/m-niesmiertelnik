# PowerShell test script
Write-Host "🚀 Testing API endpoints..." -ForegroundColor Green

Write-Host "`n1. Testing basic endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "http://localhost:8000/" -Method GET
    Write-Host "✅ SUCCESS: " -ForegroundColor Green -NoNewline
    Write-Host ($response | ConvertTo-Json)
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n2. Testing user registration..." -ForegroundColor Yellow
try {
    $userData = @{
        login = "testuser002"
        password = "testpass123"
        first_name = "Anna"
        last_name = "Kowalska"
        date_of_birth = "1993-05-15"
    }
    $body = $userData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:8000/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ SUCCESS: " -ForegroundColor Green -NoNewline
    Write-Host ($response | ConvertTo-Json)
    $global:userId = $response.user_id
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n3. Testing login..." -ForegroundColor Yellow
try {
    $loginData = @{
        login = "testuser002"
        password = "testpass123"
    }
    $body = $loginData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:8000/login" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ SUCCESS: " -ForegroundColor Green -NoNewline
    Write-Host ($response | ConvertTo-Json)
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n4. Testing token generation..." -ForegroundColor Yellow
try {
    $tokenData = @{
        data = @{
            name = "Test User"
            age = 30
            city = "Warsaw"
            profession = "Developer"
        }
    }
    $body = $tokenData | ConvertTo-Json -Depth 3
    $response = Invoke-RestMethod -Uri "http://localhost:8000/generateToken" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ SUCCESS: " -ForegroundColor Green -NoNewline
    Write-Host ($response | ConvertTo-Json)
    $global:encryptedToken = $response.encrypted_token
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n5. Testing token decryption..." -ForegroundColor Yellow
if ($global:encryptedToken) {
    try {
        $decryptData = @{
            encrypted_token = $global:encryptedToken
        }
        $body = $decryptData | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "http://localhost:8000/decryptToken" -Method POST -Body $body -ContentType "application/json"
        Write-Host "✅ SUCCESS: " -ForegroundColor Green -NoNewline
        Write-Host ($response | ConvertTo-Json -Depth 3)
    } catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "⚠️  Skipped - no encrypted token available" -ForegroundColor Yellow
}

Write-Host "`n🎉 Testing completed!" -ForegroundColor Green