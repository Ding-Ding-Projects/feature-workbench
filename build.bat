@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo INCOMPLETE: trusted automatic Windows dependency acquisition is not implemented.
  exit /b 2
)
node scripts\build.mjs
exit /b %errorlevel%
