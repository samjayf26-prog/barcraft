@echo off
title BarCraft PWA Server
cd /d "%~dp0"
"%USERPROFILE%\.local\bin\uv.exe" run server.py
pause
