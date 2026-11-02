[CmdletBinding()]
param([switch]$Silent, [switch]$ElevatedChild, [string]$ToolsRoot)
Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
try {
    if ($env:OS -ne 'Windows_NT') { throw 'This entrypoint supports Windows x64 only.' }
    if ($env:PROCESSOR_ARCHITEW6432 -and $env:PROCESSOR_ARCHITEW6432 -ne 'AMD64') { throw 'Unsupported Windows architecture.' }
    if (!$env:PROCESSOR_ARCHITEW6432 -and $env:PROCESSOR_ARCHITECTURE -ne 'AMD64') { throw 'Unsupported Windows architecture: x64 is required.' }
    if ($env:SILENT -eq '1') { $Silent = $true }
    if (!$ToolsRoot) { $ToolsRoot = Join-Path ([Environment]::GetFolderPath('LocalApplicationData')) 'SampleWorkbench\tools' }
    $identity = [Security.Principal.WindowsIdentity]::GetCurrent()
    $principal = New-Object Security.Principal.WindowsPrincipal($identity)
    $admin = $principal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
    if ($ElevatedChild -and !$admin) { throw 'Elevation was not granted.' }
    if (!$Silent -and !$admin) {
        if (![Environment]::UserInteractive -or [Console]::IsInputRedirected -or $env:CI) {
            throw 'Interactive elevation is unavailable; use build.bat /s for a noninteractive user-scoped build.'
        }
        Write-Host 'Requesting Windows administrator consent. Only you can approve the native UAC prompt.'
        # Only fixed switches and quoted local paths cross the native elevation boundary.
        $scriptPath = $PSCommandPath
        if ($scriptPath.Contains('"') -or $ToolsRoot.Contains('"')) { throw 'Invalid path quoting.' }
        $arguments = '-NoProfile -ExecutionPolicy Bypass -File "{0}" -ElevatedChild -ToolsRoot "{1}"' -f $scriptPath, $ToolsRoot
        $child = Start-Process -FilePath (Join-Path $PSHOME 'powershell.exe') -ArgumentList $arguments -Verb RunAs -Wait -PassThru
        exit $child.ExitCode
    }
    if ($Silent -and !$admin) { Write-Host 'Noninteractive build: continuing without elevation; no consent prompt will appear.' }
    Set-Location -LiteralPath (Join-Path $PSScriptRoot '..')
    . (Join-Path $PSScriptRoot 'bootstrap.ps1')
    $manifest = Get-Content -LiteralPath (Join-Path $PSScriptRoot 'build-tools.json') -Raw | ConvertFrom-Json
    $package = Get-Content -LiteralPath 'package.json' -Raw | ConvertFrom-Json
    foreach ($kind in @('dependencies', 'devDependencies', 'optionalDependencies')) {
        if ($package.PSObject.Properties.Name -contains $kind -and @($package.$kind.PSObject.Properties).Count) {
            throw "Project packages now exist ($kind); update the committed locked bootstrap inventory before building."
        }
    }
    Write-Host '[1/4] Verify or install build dependencies'
    $node = $null
    foreach ($tool in $manifest.tools) {
        $exe = Install-BuildTool $tool $ToolsRoot
        $env:PATH = (Split-Path -Parent $exe) + [IO.Path]::PathSeparator + $env:PATH
        if ($tool.name -eq 'node') { $node = $exe }
    }
    if (!$node) { throw 'Node is missing from the build inventory.' }
    $result = Invoke-BuildPhases $node
    if ($result -ne 0) { exit $result }
    if (!(Test-Path -LiteralPath 'dist/index.html') -or !(Test-Path -LiteralPath 'dist/build-info.json')) { throw 'Required build artifacts are missing.' }
    Write-Host 'Build complete: dist/index.html. No native installer was created.'
    if (!$Silent) {
        $answer = Read-Host 'Run the built application in your browser now? [y/N]'
        if ($answer -match '^(?i)y(es)?$') {
            # Native launches are always loopback-only, regardless of container environment settings.
            $env:HOST = '127.0.0.1'
            $env:PORT = '0'
            & $node scripts/serve.mjs --open
            if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
        }
    }
    exit 0
} catch {
    Write-Error "INCOMPLETE: $($_.Exception.Message)" -ErrorAction Continue
    exit 1
}
