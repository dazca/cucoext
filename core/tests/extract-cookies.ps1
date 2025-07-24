# PowerShell script to extract cookies from Chrome
# Run this after logging into cuco360.cucorent.com

param(
    [string]$ProfilePath = "$env:LOCALAPPDATA\Google\Chrome\User Data\Default"
)

Write-Host "🔍 Extracting cookies from Chrome..." -ForegroundColor Cyan

# Path to Chrome cookies database
$CookiesDB = Join-Path $ProfilePath "Network\Cookies"

if (-not (Test-Path $CookiesDB)) {
    Write-Host "❌ Chrome cookies database not found at: $CookiesDB" -ForegroundColor Red
    Write-Host "Please ensure Chrome is closed and you're logged into cuco360.cucorent.com" -ForegroundColor Yellow
    exit 1
}

try {
    # Load SQLite assembly (requires SQLite)
    Add-Type -Path "System.Data.SQLite.dll" -ErrorAction SilentlyContinue
    
    Write-Host "📂 Opening Chrome cookies database..." -ForegroundColor Yellow
    
    # Create connection to SQLite database
    $connectionString = "Data Source=$CookiesDB;Version=3;Read Only=True;"
    $connection = New-Object System.Data.SQLite.SQLiteConnection($connectionString)
    $connection.Open()
    
    # Query for cuco360 cookies
    $query = "SELECT name, encrypted_value, host_key FROM cookies WHERE host_key LIKE '%cuco360.cucorent.com%'"
    $command = New-Object System.Data.SQLite.SQLiteCommand($query, $connection)
    $reader = $command.ExecuteReader()
    
    $cookies = @{}
    
    while ($reader.Read()) {
        $name = $reader["name"]
        $encryptedValue = $reader["encrypted_value"]
        $hostKey = $reader["host_key"]
        
        Write-Host "🍪 Found cookie: $name for $hostKey" -ForegroundColor Green
        
        # Note: Chrome encrypts cookie values, would need additional decryption
        # For now, we'll guide the user to extract manually
        $cookies[$name] = "encrypted_value_found"
    }
    
    $reader.Close()
    $connection.Close()
    
    if ($cookies.Count -eq 0) {
        Write-Host "❌ No cuco360 cookies found. Please:" -ForegroundColor Red
        Write-Host "1. Make sure you're logged into cuco360.cucorent.com in Chrome" -ForegroundColor Yellow
        Write-Host "2. Close Chrome completely" -ForegroundColor Yellow
        Write-Host "3. Run this script again" -ForegroundColor Yellow
    } else {
        Write-Host "✅ Found $($cookies.Count) cuco360 cookies" -ForegroundColor Green
        Write-Host "Note: Chrome encrypts cookie values. Use the manual extraction method instead." -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error accessing Chrome cookies: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Use the manual extraction method with extract-tokens.js instead" -ForegroundColor Cyan
}

Write-Host "`n🚀 To extract tokens manually, run:" -ForegroundColor Cyan
Write-Host "node extract-tokens.js" -ForegroundColor White
