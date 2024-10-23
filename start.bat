@echo off
cd C:\Users\hanso\Downloads\Budget-Manager-main\Budget-Manager-main
start py -m http.server 8000
timeout /t 2
start http://localhost:8000
