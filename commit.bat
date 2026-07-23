@echo off
REM Run from the repository root (directory of this script)
cd /d "%~dp0"
git commit -m "feat: add Vercel deployment configs"
git push origin HEAD

