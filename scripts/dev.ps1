$root = Split-Path -Parent $PSScriptRoot
$backendPath = Join-Path $root "backend"
$frontendPath = Join-Path $root "frontend"

$backendCommand = "Set-Location -LiteralPath '$backendPath'; pnpm dev"
$frontendCommand = "Set-Location -LiteralPath '$frontendPath'; pnpm dev"

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand -WorkingDirectory $backendPath
Start-Process powershell -ArgumentList "-NoExit", "-Command", $frontendCommand -WorkingDirectory $frontendPath

Write-Host "Started backend and frontend dev servers in separate PowerShell windows."
Write-Host "Backend:  $backendPath"
Write-Host "Frontend: $frontendPath"
