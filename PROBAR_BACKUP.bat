@echo off
REM ========================================
REM PRUEBA DE BACKUP - Sistema de Ventas
REM ========================================

echo.
echo ========================================
echo   PRUEBA DE BACKUP
echo   Sistema de Ventas
echo ========================================
echo.

REM Verificar que la carpeta de Google Drive existe
set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva

echo [1/5] Verificando carpeta de Google Drive...
if exist "%BACKUP_DIR%" (
    echo OK - Carpeta encontrada: %BACKUP_DIR%
) else (
    echo ERROR - Carpeta NO encontrada: %BACKUP_DIR%
    echo.
    echo Por favor, verifica que:
    echo 1. Google Drive Desktop este instalado
    echo 2. La carpeta "Backups_Licoreria_Cueva" exista en "G:\Mi unidad\"
    echo.
    pause
    exit /b 1
)

REM Verificar que Docker esta corriendo
echo.
echo [2/5] Verificando Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR - Docker no esta corriendo
    echo Por favor, inicia Docker Desktop
    pause
    exit /b 1
)
echo OK - Docker esta corriendo

REM Verificar que el contenedor de la base de datos existe
echo.
echo [3/5] Verificando contenedor de base de datos...
docker ps | findstr ventas_db >nul
if %errorlevel% neq 0 (
    echo ERROR - Contenedor ventas_db no esta corriendo
    echo Por favor, inicia el sistema con INICIAR_SISTEMA.bat
    pause
    exit /b 1
)
echo OK - Contenedor ventas_db esta corriendo

REM Crear un backup de prueba
echo.
echo [4/5] Creando backup de prueba...

REM Obtener fecha y hora sin espacios usando PowerShell
for /f "tokens=*" %%i in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set DATETIME=%%i
set BACKUP_FILE=backup_PRUEBA_%DATETIME%.sql

REM Crear archivo temporal
set TEMP_BACKUP=%TEMP%\backup_prueba_%DATETIME%.sql
docker exec ventas_db mysqldump -uroot -proot123 sistema_ventas 2>nul > "%TEMP_BACKUP%"

REM Verificar que el archivo se creo y tiene contenido
if exist "%TEMP_BACKUP%" (
    for %%A in ("%TEMP_BACKUP%") do set TEMP_SIZE=%%~zA
    
    if %TEMP_SIZE% GTR 1000 (
        REM Mover archivo a Google Drive
        move /Y "%TEMP_BACKUP%" "%BACKUP_DIR%\%BACKUP_FILE%" >nul 2>&1
        
        if exist "%BACKUP_DIR%\%BACKUP_FILE%" (
            echo OK - Backup creado exitosamente
            echo.
            echo Archivo: %BACKUP_FILE%
            echo Ubicacion: %BACKUP_DIR%
            
            REM Obtener tamano del archivo
            for %%A in ("%BACKUP_DIR%\%BACKUP_FILE%") do set SIZE=%%~zA
            echo Tamano: %SIZE% bytes
            echo.
            echo El backup parece correcto
        ) else (
            echo ERROR - No se pudo mover el archivo a Google Drive
            del "%TEMP_BACKUP%" 2>nul
            pause
            exit /b 1
        )
    ) else (
        echo ERROR - El backup esta vacio (solo %TEMP_SIZE% bytes)
        del "%TEMP_BACKUP%" 2>nul
        pause
        exit /b 1
    )
) else (
    echo ERROR - No se pudo crear el archivo de backup
    pause
    exit /b 1
)

REM Verificar que el archivo existe en Google Drive
echo.
echo [5/5] Verificando archivo en Google Drive...
if exist "%BACKUP_DIR%\%BACKUP_FILE%" (
    echo OK - Archivo guardado en Google Drive
    echo.
    echo Abre Google Drive en el navegador para verificar
    echo que se este sincronizando con la nube.
) else (
    echo ERROR - Archivo no encontrado
)

echo.
echo ========================================
echo   PRUEBA COMPLETADA
echo ========================================
echo.
echo Resumen:
echo - Carpeta: OK
echo - Docker: OK
echo - Contenedor: OK
echo - Backup: OK
echo - Archivo: %BACKUP_FILE%
echo - Tamano: %SIZE% bytes
echo.
echo Ahora puedes usar BACKUP_AUTOMATICO.bat con confianza.
echo.
pause
