@echo off
title Projeto Paradiso - Inicializador
color 0b

echo ===================================================
echo       INICIANDO O PROJETO PARADISO (FLASK)         
echo ===================================================
echo.

:: 1. Verifica se a pasta venv ja existe, se nao existir, cria
if not exist "venv" (
    echo [*] Criando ambiente virtual isolado (venv)...
    python -m venv venv
    if errorlevel 1 (
        echo [ERRO] O Python nao foi encontrado no sistema!
        echo Verifique se o Python esta instalado e no PATH do Windows.
        pause
        exit /b
    )
    echo [*] Ambiente virtual criado com sucesso!
    echo.
)

:: 2. Instala as dependencias do requirements.txt usando o python da venv
echo [*] Verificando dependencias (Flask)...
call .\venv\Scripts\pip.exe install -r requirements.txt
if errorlevel 1 (
    echo [ERRO] Falha ao instalar as dependencias.
    pause
    exit /b
)

echo.
echo ===================================================
echo [*] Servidor pronto!
echo [*] Acesse no navegador: http://127.0.0.1:5000
echo [*] Pressione Ctrl + C para encerrar o servidor.
echo ===================================================
echo.

:: 3. Executa a aplicacao Flask com o python isolado da venv
.\venv\Scripts\python.exe app.py

pause