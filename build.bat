@echo off
setlocal
rem Opt out before PowerShell starts; inherited by build child processes.
set "POWERSHELL_TELEMETRY_OPTOUT=1"
set "BUILD_SILENT="
for %%A in (%*) do (
  if /i "%%~A"=="/s" set "BUILD_SILENT=-Silent"
  if /i "%%~A"=="--silent" set "BUILD_SILENT=-Silent"
)
if "%SILENT%"=="1" set "BUILD_SILENT=-Silent"
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\build.ps1" %BUILD_SILENT%
set "RC=%ERRORLEVEL%"
endlocal & exit /b %RC%
