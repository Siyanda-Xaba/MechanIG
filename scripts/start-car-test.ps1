$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$adb = $null
$sdkCandidates = @($env:ANDROID_HOME, $env:ANDROID_SDK_ROOT)
if ($env:USERPROFILE) { $sdkCandidates += (Join-Path $env:USERPROFILE 'AppData\Local\Android\Sdk') }
if ($env:LOCALAPPDATA) { $sdkCandidates += (Join-Path $env:LOCALAPPDATA 'Android\Sdk') }
foreach ($sdk in $sdkCandidates) {
  if ($sdk) {
    $candidate = Join-Path $sdk 'platform-tools\adb.exe'
    if (Test-Path -LiteralPath $candidate) { $adb = $candidate; break }
  }
}
if (-not $adb) {
  $adbCommand = Get-Command adb -ErrorAction SilentlyContinue
  if ($adbCommand) { $adb = $adbCommand.Source }
}
if (-not $adb) { throw 'Android Debug Bridge not found. Set ANDROID_HOME or install Android SDK platform-tools.' }

$devices = @(& $adb devices | Select-Object -Skip 1 | Where-Object { $_ -match '^\S+\s+device$' })
if ($LASTEXITCODE -ne 0 -or $devices.Count -ne 1) {
  throw 'Connect exactly one Android phone to this computer with USB debugging enabled.'
}
$serial = ($devices[0] -split '\s+')[0]

$pictureHealthUrl = 'http://127.0.0.1:3002/health'
$obdHealthUrl = 'http://127.0.0.1:5002/health/ready'
$soundHealthUrl = 'http://127.0.0.1:8000/health/ready'
try {
  $pictureHealth = Invoke-RestMethod -Uri $pictureHealthUrl -TimeoutSec 3
  $obdHealth = Invoke-RestMethod -Uri $obdHealthUrl -TimeoutSec 3
  $soundHealth = Invoke-RestMethod -Uri $soundHealthUrl -TimeoutSec 3
} catch {
  throw 'Start npm start from the MechanIQ project folder first. It starts the APIs, including sound detection; keep that terminal open.'
}
if (-not $pictureHealth.ok -or $obdHealth.status -ne 'ready' -or $soundHealth.status -ne 'ready') {
  throw 'A picture-search, OBD, or sound-detection API is not ready. Check the npm start terminal.'
}

foreach ($port in @(3002, 5002, 8000)) {
  & $adb -s $serial reverse "tcp:$port" "tcp:$port"
  if ($LASTEXITCODE -ne 0) { throw "Could not create the USB reverse tunnel on port $port." }
}
$apk = Join-Path $projectRoot 'android\app\build\outputs\apk\release\app-release.apk'
if (-not (Test-Path -LiteralPath $apk)) { throw "Release APK not found: $apk" }
& $adb -s $serial install -r $apk
if ($LASTEXITCODE -ne 0) { throw 'Could not install or update the MechanIQ APK.' }
Write-Host "USB tunnels ready for Android device $serial (3002 picture search, 5002 OBD, 8000 sound detection)."
Write-Host 'All API health checks passed and the release APK is installed. Keep npm start and the USB connection active during testing.'
