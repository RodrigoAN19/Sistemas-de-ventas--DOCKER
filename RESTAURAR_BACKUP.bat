@echo off
REM ========================================
REM SISTEMA DE VENTAS - RESTAURAR BACKUP
REM Licoreria Cueva
REM ========================================

setlocal enabledelayedexpansion

set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva

echo.
echo ========================================
echo   RESTAURAR BACKUP - SISTEMA DE VENTAS
echo   Licoreria Cueva
echo ========================================
echo.
echo ADVERTENCIA: Este proceso restaurara la base de datos
echo a un estado anterior. Los datos actuales se perderan.
echo.
echo Presiona CTRL+C para cancelar
echo Presiona cualquier tecla para continuar...
pause >nul

REM Verificar si Docker esta corriendo
echo.
echo [1/4] Verificando Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta corriendo.
    echo Por favor, inicia Docker Desktop y vuelve a intentar.
    pause
    exit /b 1
)
echo OK - Docker esta corriendo

REM Listar backups disponibles
echo.
echo [2/4] Backups disponibles:
echo.
dir /B /O-D "%BACKUP_DIR%\backup_ventas_*.sql" 2>nul
if %errorlevel% neq 0 (
    echo ERROR: No se encontraron backups en:
    echo %BACKUP_DIR%
    pause
    exit /b 1
)

echo.
echo Ingresa el nombre COMPLETO del archivo de backup
echo (ejemplo: backup_ventas_20260128_1430.sql)
echo.
set /p BACKUP_FILE="Nombre del archivo: "

REM Verificar que el archivo existe
if not exist "%BACKUP_DIR%\%BACKUP_FILE%" (
    echo.
    echo ERROR: El archivo no existe:
    echo %BACKUP_DIR%\%BACKUP_FILE%
    pause
    exit /b 1
)

echo.
echo [3/4] Preparando restauracion...
echo Archivo: %BACKUP_FILE%
echo.
echo ULTIMA ADVERTENCIA: Esto borrara todos los datos actuales
echo Presiona CTRL+C para cancelar
echo Presiona cualquier tecla para continuar...
pause >nul

REM Restaurar backup
echo.
echo [4/4] Restaurando backup...
docker exec -i ventas_db mysql -uroot -proot123 sistema_ventas < "%BACKUP_DIR%\%BACKUP_FILE%"

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo   RESTAURACION COMPLETADA EXITOSAMENTE
    echo ========================================
    echo.
    echo La base de datos ha sido restaurada.
    echo Reinicia el sistema para ver los cambios.
    echo.
    echo Registro: %date% %time% - Restaurado desde %BACKUP_FILE% >> "%BACKUP_DIR%\restore_log.txt"
) else (
    echo.
    echo ERROR: No se pudo restaurar el backup
    echo Verifica que el archivo sea valido.
    pause
    exit /b 1
)

echo.
pause
exit
