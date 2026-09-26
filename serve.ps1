# ============================================================================
# BarCraft Local Development & iPhone Wi-Fi Server
# High-Performance Socket HTTP Server - Zero dependencies required
# Binds to 0.0.0.0 so iPhone Safari can connect over Wi-Fi without admin rights
# ============================================================================

$port = 8080
$baseDir = $PSScriptRoot

# Detect Local Wi-Fi IPv4 Address
$wifiIp = (Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias "Wi-Fi*", "Ethernet*" -ErrorAction SilentlyContinue | 
           Where-Object { $_.IPAddress -notlike "169.254*" } | 
           Select-Object -ExpandProperty IPAddress -First 1)

if (-not $wifiIp) {
    $wifiIp = "127.0.0.1"
}

$localUrl = "http://localhost:$port/"
$networkUrl = "http://${wifiIp}:$port/"

$listener = [System.Net.Sockets.TcpListener]::new([System.Net.IPAddress]::Any, $port)
$listener.Start()

Write-Host ""
Write-Host "==================================================================" -ForegroundColor DarkGray
Write-Host "             BARCRAFT - PROGRESSIVE WEB APP SERVER                " -ForegroundColor DarkYellow
Write-Host "==================================================================" -ForegroundColor DarkGray
Write-Host ""
Write-Host "  On this PC browser:      $localUrl" -ForegroundColor Cyan
Write-Host "  On your iPhone (Safari): $networkUrl" -ForegroundColor Green
Write-Host ""
Write-Host "------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  How to install on your iPhone:" -ForegroundColor White
Write-Host "   1. Ensure your iPhone is connected to the same Wi-Fi network."
Write-Host "   2. Open Safari on your iPhone and go to: $networkUrl" -ForegroundColor Green
Write-Host "   3. Tap the Share icon (square with arrow pointing up) at the bottom."
Write-Host "   4. Scroll and tap 'Add to Home Screen', then tap 'Add'."
Write-Host "   5. Open BarCraft from your Home Screen for full-screen PWA mode!"
Write-Host "------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "  Press Ctrl+C in this window to stop the server at any time." -ForegroundColor DarkGray
Write-Host ""

$mimeTypes = @{
    ".html" = "text/html; charset=utf-8"
    ".css"  = "text/css; charset=utf-8"
    ".js"   = "application/javascript; charset=utf-8"
    ".json" = "application/json; charset=utf-8"
    ".png"  = "image/png"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".txt"  = "text/plain; charset=utf-8"
}

try {
    while ($true) {
        $client = $listener.AcceptTcpClient()
        try {
            $stream = $client.GetStream()
            $reader = New-Object System.IO.StreamReader($stream)
            $requestLine = $reader.ReadLine()

            if ($requestLine) {
                $parts = $requestLine.Split(" ")
                if ($parts.Length -ge 2) {
                    $rawPath = $parts[1].Split("?")[0].TrimStart([char]47)
                    if ([string]::IsNullOrWhiteSpace($rawPath)) {
                        $rawPath = "index.html"
                    }

                    $filePath = Join-Path $baseDir $rawPath

                    if (Test-Path $filePath -PathType Leaf) {
                        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
                        $mime = if ($mimeTypes.ContainsKey($ext)) { $mimeTypes[$ext] } else { "application/octet-stream" }
                        $bytes = [System.IO.File]::ReadAllBytes($filePath)

                        $header = "HTTP/1.1 200 OK`r`nContent-Type: $mime`r`nContent-Length: $($bytes.Length)`r`nAccess-Control-Allow-Origin: *`r`nConnection: close`r`n`r`n"
                        $headerBytes = [System.Text.Encoding]::ASCII.GetBytes($header)
                        $stream.Write($headerBytes, 0, $headerBytes.Length)
                        $stream.Write($bytes, 0, $bytes.Length)
                    } else {
                        $notFound = "HTTP/1.1 404 Not Found`r`nContent-Length: 9`r`nConnection: close`r`n`r`nNot Found"
                        $notFoundBytes = [System.Text.Encoding]::ASCII.GetBytes($notFound)
                        $stream.Write($notFoundBytes, 0, $notFoundBytes.Length)
                    }
                    $stream.Flush()
                }
            }
        } catch {
            # Ignore individual connection errors
        } finally {
            $client.Close()
        }
    }
} finally {
    $listener.Stop()
}
