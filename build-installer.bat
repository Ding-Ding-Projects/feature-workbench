@echo off
setlocal
rem This browser-only target has no supported native installer format.
rem No build, download, elevation, launch, publication or fake package is performed.
echo NOT APPLICABLE: This project produces a static browser application, not an installable desktop target.
echo No installer was created. Use build.bat to build dist; see README.md.
endlocal & exit /b 2
