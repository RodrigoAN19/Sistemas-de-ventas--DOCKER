@echo off
REM ========================================
REM SISTEMA DE VENTAS - LICORERIA CUEVA
REM Script de Arranque Automatico
REM ========================================

echo.
echo ========================================
echo   INICIANDO SISTEMA DE VENTAS
echo   Licoreria Cueva
echo ========================================
echo.

REM Verificar si Docker esta corriendo
echo [1/4] Verificando Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta corriendo.
    echo Por favor, inicia Docker Desktop y vuelve a intentar.
    pause
    exit /b 1
)
echo OK - Docker esta corriendo

REM Ir al directorio del proyecto
cd /d "%~dp0"

REM Iniciar los contenedores
echo.
echo [2/4] Iniciando servicios...
docker-compose up -d

REM Esperar a que los servicios esten listos
echo.
echo [3/4] Esperando a que el sistema este listo...
timeout /t 15 /nobreak >nul

REM Abrir el navegador
echo.
echo [4/4] Abriendo el sistema en el navegador...
start http://localhost:3000

echo.
echo ========================================
echo   SISTEMA LISTO PARA USAR
echo ========================================
echo.
echo El sistema se ha abierto en tu navegador.
echo.
echo Usuario: admin
echo Contrasena: admin123
echo.
echo Puedes cerrar esta ventana.
echo ========================================
echo.

REM Esperar 5 segundos antes de cerrar
timeout /t 5 /nobreak >nul
exit
