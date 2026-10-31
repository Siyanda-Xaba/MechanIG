param(
  [string]$PythonExe = ''
)

$ErrorActionPreference = 'Stop'
$projectRoot = Split-Path -Parent $PSScriptRoot
$requirements = Join-Path $projectRoot 'backend\sound-detection\requirements-api.txt'
if (-not (Test-Path -LiteralPath $requirements)) {
  throw "Sound detection runtime requirements are missing: $requirements"
}

if (-not $PythonExe) {
  $pythonCommand = Get-Command python -ErrorAction SilentlyContinue
  if ($pythonCommand -and $pythonCommand.Source -notlike '*WindowsApps*') {
    $PythonExe = $pythonCommand.Source
  }
}
if (-not $PythonExe -or -not (Test-Path -LiteralPath $PythonExe)) {
  throw 'Install 64-bit Python 3.12, then rerun this script with -PythonExe if Python is not on PATH.'
}

$version = & $PythonExe -c 'import sys; print("%d.%d" % sys.version_info[:2])'
if ($LASTEXITCODE -ne 0 -or [version]$version -lt [version]'3.10') {
  throw 'Sound detection requires Python 3.10 or newer.'
}

$venvRoot = Join-Path $env:LOCALAPPDATA 'MechanIQ\sound-detection'
$venvPython = Join-Path $venvRoot 'venv\Scripts\python.exe'
if (-not (Test-Path -LiteralPath $venvPython)) {
  New-Item -ItemType Directory -Force -Path $venvRoot | Out-Null
  & $PythonExe -m venv (Join-Path $venvRoot 'venv')
  if ($LASTEXITCODE -ne 0) { throw 'Could not create the sound detection Python environment.' }
}

& $venvPython -m pip install -r $requirements
if ($LASTEXITCODE -ne 0) { throw 'Could not install the sound detection API requirements.' }

$environmentFile = Join-Path $projectRoot '.env.local'
$setting = "MECHANIQ_SOUND_PYTHON=$venvPython"
$lines = if (Test-Path -LiteralPath $environmentFile) { @(Get-Content -LiteralPath $environmentFile) } else { @() }
$found = $false
for ($index = 0; $index -lt $lines.Count; $index += 1) {
  if ($lines[$index] -match '^\s*MECHANIQ_SOUND_PYTHON\s*=') {
    $lines[$index] = $setting
    $found = $true
  }
}
if (-not $found) { $lines += $setting }
[System.IO.File]::WriteAllText($environmentFile, ($lines -join [Environment]::NewLine) + [Environment]::NewLine, [System.Text.UTF8Encoding]::new($false))
Write-Host 'Sound detection Python dependencies are installed and the local launcher is configured.'
