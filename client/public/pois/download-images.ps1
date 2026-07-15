# Script para descargar imagenes de POIs desde URLs de fallback
# Uso: PowerShell -ExecutionPolicy Bypass -File download-images.ps1

$fallbackUrls = Get-Content 'fallback-urls.json' | ConvertFrom-Json
$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "Descargando imagenes de POIs..."
Write-Host "Destino: $scriptDir"
Write-Host ""

$downloaded = 0
$failed = 0

foreach ($poiId in $fallbackUrls.PSObject.Properties.Name) {
  $url = $fallbackUrls.$poiId
  $filename = "$poiId.jpg"
  $filepath = Join-Path $scriptDir $filename

  try {
    Write-Host -NoNewline "  $poiId... "

    # Si ya existe, saltarlo
    if (Test-Path $filepath) {
      Write-Host "(ya existe)"
      continue
    }

    # Descargar con timeout
    $ProgressPreference = 'SilentlyContinue'
    Invoke-WebRequest -Uri $url -OutFile $filepath -TimeoutSec 10 -ErrorAction Stop
    Write-Host "OK"
    $downloaded++
  }
  catch {
    Write-Host "ERROR: $($_.Exception.Message)"
    $failed++
    # Limpiar archivo incompleto
    if (Test-Path $filepath) { Remove-Item $filepath }
  }
}

Write-Host ""
Write-Host "Resumen:"
Write-Host "  Descargadas: $downloaded"
Write-Host "  Fallidas: $failed"
Write-Host "  Total: $($fallbackUrls.PSObject.Properties.Count)"
