# Offline safety and control-flow tests. No downloads, installs, UAC or host changes.
param([string]$Node)
$ErrorActionPreference = 'Stop'
. (Join-Path $PSScriptRoot '../scripts/bootstrap.ps1')
function Assert-True($Condition, [string]$Message) { if (!$Condition) { throw $Message } }
function Assert-Throws([scriptblock]$Action, [string]$Message) {
    $failed = $false
    try { & $Action } catch { $failed = $true }
    Assert-True $failed $Message
}
$temporary = Join-Path ([IO.Path]::GetTempPath()) "sample-bootstrap-test-$([guid]::NewGuid().ToString('N'))"
$original = Get-Location
try {
    New-Item -ItemType Directory -Path $temporary | Out-Null
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $archive = Join-Path $temporary 'safe.zip'
    $zip = [IO.Compression.ZipFile]::Open($archive, 'Create')
    $entry = $zip.CreateEntry('tool.txt')
    $writer = New-Object IO.StreamWriter($entry.Open())
    $writer.Write('verified fixture'); $writer.Dispose(); $zip.Dispose()
    $hash = (Get-FileHash $archive -Algorithm SHA256).Hash
    Assert-True (Test-ArchiveHash $archive $hash) 'Correct hash rejected'
    Assert-True (!(Test-ArchiveHash $archive ('0' * 64))) 'Wrong hash accepted'
    $badDestination = Join-Path $temporary 'bad'
    Assert-Throws { Expand-VerifiedArchive $archive ('0' * 64) $badDestination } 'Mismatched archive extracted'
    Assert-True (!(Test-Path $badDestination)) 'Hash failure modified destination'
    $destination = Join-Path $temporary 'valid'
    Expand-VerifiedArchive $archive $hash $destination
    Assert-True ((Get-Content (Join-Path $destination 'tool.txt')) -eq 'verified fixture') 'Valid extraction failed'
    foreach ($name in @('../escape.txt', '/absolute.txt', 'C:/absolute.txt', 'folder/../../escape.txt', 'folder\..\escape.txt', 'file:stream')) {
        $unsafe = Join-Path $temporary "unsafe-$([guid]::NewGuid().ToString('N')).zip"
        $zip = [IO.Compression.ZipFile]::Open($unsafe, 'Create')
        $null = $zip.CreateEntry($name); $zip.Dispose()
        $unsafeHash = (Get-FileHash $unsafe -Algorithm SHA256).Hash
        Assert-Throws { Expand-VerifiedArchive $unsafe $unsafeHash (Join-Path $temporary 'unsafe') } "Unsafe ZIP entry accepted: $name"
    }
    Assert-True (Test-CompatibleTool $Node 20) 'Compatible Node rejected'
    Assert-True (!(Test-CompatibleTool $Node 999)) 'Incompatible Node accepted'
    Assert-True (!(Test-CompatibleTool (Join-Path $temporary 'absent') 20)) 'Missing executable accepted'
    # Real child process exit codes: failed tests/checks must prevent subsequent phases.
    $fixture = Join-Path $temporary 'build'
    New-Item -ItemType Directory -Path (Join-Path $fixture 'tests'), (Join-Path $fixture 'scripts') | Out-Null
    Set-Location $fixture
    Set-Content tests/fixture.test.mjs "process.exit(7);"
    Set-Content scripts/check.mjs "import {writeFileSync} from 'node:fs'; writeFileSync('checked','yes');"
    Set-Content scripts/build.mjs "import {writeFileSync} from 'node:fs'; writeFileSync('built','yes');"
    Assert-True ((Invoke-BuildPhases $Node) -ne 0) 'Failed tests reported success'
    Assert-True (!(Test-Path checked) -and !(Test-Path built)) 'Continued after failed tests'
    Set-Content tests/fixture.test.mjs "import {test} from 'node:test'; test('fixture',()=>{});"
    Set-Content scripts/check.mjs "process.exit(23);"
    Assert-True ((Invoke-BuildPhases $Node) -eq 23) 'Check exit code was not propagated'
    Assert-True (!(Test-Path built)) 'Continued after failed check'
    Set-Content scripts/check.mjs "process.exit(0);"
    Set-Content scripts/build.mjs "process.exit(31);"
    Assert-True ((Invoke-BuildPhases $Node) -eq 31) 'Build exit code was not propagated'
    Set-Content scripts/build.mjs "import {writeFileSync} from 'node:fs'; writeFileSync('built','yes');"
    Assert-True ((Invoke-BuildPhases $Node) -eq 0) 'Valid build failed'
    Assert-True (Test-Path built) 'Successful build did not execute'
    # Install state machine with a fake downloader and version probe, never a real install.
    $script:downloads = 0
    $script:downloadFixture = $archive
    function Invoke-WebRequest { param($Uri, $OutFile, [switch]$UseBasicParsing)
        $script:downloads++; Copy-Item -LiteralPath $script:downloadFixture -Destination $OutFile
    }
    function Test-CompatibleTool([string]$Executable, [int]$MinimumMajor) {
        return (Test-Path -LiteralPath $Executable) -and (Get-Content -LiteralPath $Executable -Raw) -eq 'verified fixture'
    }
    $fixtureTool = [pscustomobject]@{
        name='sample-nonexistent-test-tool'; version='1.0'; minimumMajor=1
        url='https://example.invalid/test-only'; sha256=$hash; archiveRoot=''
        executable='tool.txt'; executableSha256=(Get-FileHash (Join-Path $destination 'tool.txt') -Algorithm SHA256).Hash
    }
    $cache = Join-Path $temporary 'cache'
    $installed = Install-BuildTool $fixtureTool $cache
    Assert-True (Test-Path $installed) 'Cold installation did not activate'
    Assert-True ($script:downloads -eq 1) 'Cold installation did not download once'
    Assert-True ((Install-BuildTool $fixtureTool $cache) -eq $installed) 'Warm cache not reused'
    Assert-True ($script:downloads -eq 1) 'Warm installation downloaded again'
    Set-Content -LiteralPath $installed 'corrupt'
    $null = Install-BuildTool $fixtureTool $cache
    Assert-True ($script:downloads -eq 1) 'Verified archive was not reused for repair'
    Assert-True ((Get-Content -LiteralPath $installed -Raw) -eq 'verified fixture') 'Corrupt installation was not repaired'
    Set-Content -LiteralPath $installed 'retain on failed replacement'
    Set-Content -LiteralPath (Join-Path $cache 'sample-nonexistent-test-tool-1.0.zip') 'corrupt archive'
    $script:downloadFixture = Join-Path $temporary 'invalid-download'
    Set-Content -LiteralPath $script:downloadFixture 'not a verified archive'
    Assert-Throws { Install-BuildTool $fixtureTool $cache } 'Bad download was accepted'
    Assert-True ((Get-Content -LiteralPath $installed) -eq 'retain on failed replacement') 'Failed download deleted previous installation'
    Write-Host 'Offline bootstrap safety and phase tests passed. Not Windows runtime/UAC proof.'
} finally {
    Set-Location $original
    Remove-Item -LiteralPath $temporary -Recurse -Force
}
