@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   PRUEBA RAPIDA DE BACKUP
echo ========================================
echo.

REM Configuracion
set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva

REM Obtener fecha y hora sin espacios usando PowerShell
for /f "tokens=*" %%i in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set DATETIME=%%i
set BACKUP_FILE=backup_TEST_%DATETIME%.sql
set TEMP_BACKUP=%TEMP%\backup_test_%DATETIME%.sql

echo [1/4] Creando backup temporal...
docker exec ventas_db mysqldump -uroot -proot123 sistema_ventas 2>nul > "%TEMP_BACKUP%"

echo [2/4] Esperando...
timeout /t 2 /nobreak >nul

echo [3/4] Verificando archivo...
if not exist "%TEMP_BACKUP%" (
    echo ERROR: Archivo no se creo
    pause
    exit /b 1
)

echo OK - Archivo creado

echo [4/4] Verificando tamano...
for %%A in ("%TEMP_BACKUP%") do set TEMP_SIZE=%%~zA

echo Tamano detectado: %TEMP_SIZE% bytes

REM Usar CALL para expandir correctamente
call :CheckSize %TEMP_SIZE%
goto :Continue

:CheckSize
echo Verificando: %1 bytes
if %1 LSS 1000 (
    echo ERROR: Archivo muy pequeno
    exit /b 1
) else (
    echo OK - Tamano correcto
)
goto :eof

:Continue
echo.
echo Moviendo a Google Drive...
move /Y "%TEMP_BACKUP%" "%BACKUP_DIR%\%BACKUP_FILE%" >nul 2>&1

if exist "%BACKUP_DIR%\%BACKUP_FILE%" (
    echo OK - Archivo movido exitosamente
    echo.
    echo Ubicacion: %BACKUP_DIR%\%BACKUP_FILE%
    for %%A in ("%BACKUP_DIR%\%BACKUP_FILE%") do set FINAL_SIZE=%%~zA
    call echo Tamano final: %%FINAL_SIZE%% bytes
) else (
    echo ERROR: No se pudo mover
)

echo.
echo ========================================
echo   PRUEBA COMPLETADA
echo ========================================
pause
