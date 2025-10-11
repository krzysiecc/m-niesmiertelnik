# Test aktualizacji profilu użytkownika z datą urodzenia
Write-Host "🔄 Testowanie aktualizacji profilu użytkownika..." -ForegroundColor Green

# Najpierw utwórz użytkownika
Write-Host "`n1. Tworzenie użytkownika..." -ForegroundColor Yellow
try {
    $userData = @{
        login = "updateuser001"
        password = "testpass123"
        first_name = "Jan"
        last_name = "Kowalski"
        date_of_birth = "1990-01-01"
    }
    $body = $userData | ConvertTo-Json
    $response = Invoke-RestMethod -Uri "http://localhost:8000/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "✅ Użytkownik utworzony: " -ForegroundColor Green -NoNewline
    Write-Host ($response | ConvertTo-Json)
    $userId = $response.user_id
} catch {
    Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

if ($userId) {
    # Aktualizuj profil
    Write-Host "`n2. Aktualizacja profilu..." -ForegroundColor Yellow
    try {
        $updateData = @{
            first_name = "Janusz"
            last_name = "Nowak"
            date_of_birth = "1985-12-25"
        }
        $body = $updateData | ConvertTo-Json
        $response = Invoke-RestMethod -Uri "http://localhost:8000/users/$userId/update" -Method POST -Body $body -ContentType "application/json"
        Write-Host "✅ Profil zaktualizowany: " -ForegroundColor Green -NoNewline
        Write-Host ($response | ConvertTo-Json)
    } catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
    
    # Sprawdź zaktualizowane dane
    Write-Host "`n3. Sprawdzenie zaktualizowanych danych..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8000/users/$userId" -Method GET
        Write-Host "✅ Dane użytkownika: " -ForegroundColor Green -NoNewline
        Write-Host ($response | ConvertTo-Json)
    } catch {
        Write-Host "❌ ERROR: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Test aktualizacji zakonczony!" -ForegroundColor Green