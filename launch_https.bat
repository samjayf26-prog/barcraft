@echo off
title BarCraft HTTPS Server
cd /d "%~dp0"
"%USERPROFILE%\.local\bin\uv.exe" run start_tunnel.py
pause
