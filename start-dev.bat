@echo off
title JobFree Dev
echo Arrancando backend (puerto 8080)...
start "JobFree Backend" cmd /k "cd /d "%~dp0backend" && .\mvnw.cmd spring-boot:run"
echo Arrancando frontend (puerto 3000)...
start "JobFree Frontend" cmd /k "cd /d "%~dp0frontend" && npm start"
echo.
echo Dos ventanas abiertas. Cierra esta.
