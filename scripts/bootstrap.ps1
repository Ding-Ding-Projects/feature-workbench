# Functions only: dot-source from build.ps1 or the offline regression tests.
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Test-ArchiveHash([string]$Path, [string]$Expected) {
    if (!(Test-Path -LiteralPath $Path -PathType Leaf)) { return $false }
    return (Get-FileHash -LiteralPath $Path -Algorithm SHA256).Hash -eq $Expected
}

function Expand-VerifiedArchive([string]$Archive, [string]$Hash, [string]$Destination) {
    if (!(Test-ArchiveHash $Archive $Hash)) { throw 'Archive SHA-256 mismatch; nothing was executed.' }
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zip = [IO.Compression.ZipFile]::OpenRead($Archive)
    try {
        foreach ($entry in $zip.Entries) {
            if ($entry.FullName -match '(^[/\\]|^[A-Za-z]:|(^|[/\\])\.\.([/\\]|$)|:)') {
                throw 'Unsafe ZIP entry; extraction refused.'
            }
        }
    } finally { $zip.Dispose() }
    [IO.Compression.ZipFile]::ExtractToDirectory($Archive, $Destination)
}

function Test-CompatibleTool([string]$Executable, [int]$MinimumMajor) {
    try {
        $version = & $Executable --version 2>$null
        return $LASTEXITCODE -eq 0 -and "$version" -match '(?:^v|^git version )(\d+)\.' -and [int]$Matches[1] -ge $MinimumMajor
    } catch { return $false }
}

function Install-BuildTool($Tool, [string]$ToolsRoot) {
    $existing = Get-Command "$($Tool.name).exe" -CommandType Application -ErrorAction SilentlyContinue | Select-Object -First 1
    if ($existing -and (Test-CompatibleTool $existing.Source $Tool.minimumMajor)) {
        Write-Host "Reusing compatible $($Tool.name) installation."
        return $existing.Source
    }
    $target = Join-Path $ToolsRoot "$($Tool.name)-$($Tool.version)"
    $exe = Join-Path $target $Tool.executable
    if ((Test-ArchiveHash $exe $Tool.executableSha256) -and (Test-CompatibleTool $exe $Tool.minimumMajor)) {
        Write-Host "Reusing verified $($Tool.name) $($Tool.version) cache."
        return $exe
    }
    New-Item -ItemType Directory -Path $ToolsRoot -Force | Out-Null
    $archive = Join-Path $ToolsRoot "$($Tool.name)-$($Tool.version).zip"
    if (!(Test-ArchiveHash $archive $Tool.sha256)) {
        $download = "$archive.$([guid]::NewGuid().ToString('N')).download"
        try {
            Write-Host "Downloading $($Tool.name) $($Tool.version) from $($Tool.url)"
            # Per-process HTTPS protocol selection; no machine security or trust settings change.
            [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
            Invoke-WebRequest -Uri $Tool.url -OutFile $download -UseBasicParsing
            if (!(Test-ArchiveHash $download $Tool.sha256)) { throw 'Downloaded archive SHA-256 mismatch.' }
            Move-Item -LiteralPath $download -Destination $archive -Force
        } finally { if (Test-Path -LiteralPath $download) { Remove-Item -LiteralPath $download -Force } }
    }
    $stage = Join-Path $ToolsRoot "stage-$([guid]::NewGuid().ToString('N'))"
    try {
        Expand-VerifiedArchive $archive $Tool.sha256 $stage
        $source = $stage
        if ($Tool.archiveRoot) { $source = Join-Path $stage $Tool.archiveRoot }
        $candidate = Join-Path $source $Tool.executable
        if (!(Test-ArchiveHash $candidate $Tool.executableSha256)) { throw 'Extracted executable SHA-256 mismatch.' }
        if (!(Test-CompatibleTool $candidate $Tool.minimumMajor)) { throw 'Installed tool failed version verification.' }
        # An invalid cached copy is replaced only after its replacement is verified.
        if (Test-Path -LiteralPath $target) { Remove-Item -LiteralPath $target -Recurse -Force }
        Move-Item -LiteralPath $source -Destination $target
        return $exe
    } catch {
        throw "Dependency $($Tool.name) $($Tool.version), source $($Tool.url): $($_.Exception.Message)"
    } finally { if (Test-Path -LiteralPath $stage) { Remove-Item -LiteralPath $stage -Recurse -Force } }
}

function Invoke-BuildPhases([string]$Node) {
    # Enumerate explicitly: Node 20 on Windows does not expand a wildcard argument.
    $testFiles = @(Get-ChildItem -LiteralPath 'tests' -Filter '*.test.mjs' | Sort-Object Name | ForEach-Object { $_.FullName })
    if (!$testFiles.Count) { throw 'No test files found.' }
    Write-Host '[2/4] Tests'
    & $Node --test @testFiles | Out-Host
    if ($LASTEXITCODE -ne 0) { return $LASTEXITCODE }
    Write-Host '[3/4] Source checks'
    & $Node scripts/check.mjs | Out-Host
    if ($LASTEXITCODE -ne 0) { return $LASTEXITCODE }
    Write-Host '[4/4] Build'
    & $Node scripts/build.mjs | Out-Host
    return $LASTEXITCODE
}
