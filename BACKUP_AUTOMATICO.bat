@echo off
REM ========================================
REM SISTEMA DE VENTAS - BACKUP AUTOMATICO
REM Licoreria Cueva
REM ========================================

setlocal enabledelayedexpansion

REM Configuracion
set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva

REM Obtener fecha y hora sin espacios usando PowerShell
for /f "tokens=*" %%i in ('powershell -Command "Get-Date -Format 'yyyyMMdd_HHmmss'"') do set DATETIME=%%i
set BACKUP_FILE=backup_ventas_%DATETIME%.sql

echo.
echo ========================================
echo   BACKUP AUTOMATICO - SISTEMA DE VENTAS
echo   Licoreria Cueva
echo ========================================
echo.
echo Fecha: %date%
echo Hora: %time%
echo.

REM Crear directorio de backups si no existe
if not exist "%BACKUP_DIR%" (
    echo Creando carpeta de backups...
    mkdir "%BACKUP_DIR%"
    echo OK - Carpeta creada: %BACKUP_DIR%
) else (
    echo OK - Carpeta de backups existe
)

REM Verificar si Docker esta corriendo
echo.
echo [1/3] Verificando Docker...
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker no esta corriendo.
    echo El backup no se puede realizar.
    echo.
    echo Registro del error guardado en: %BACKUP_DIR%\error_log.txt
    echo %date% %time% - ERROR: Docker no esta corriendo >> "%BACKUP_DIR%\error_log.txt"
    pause
    exit /b 1
)
echo OK - Docker esta corriendo

REM Realizar backup
echo.
echo [2/3] Realizando backup de la base de datos...

REM Crear archivo temporal sin espacios
set TEMP_BACKUP=%TEMP%\backup_temp_%DATETIME%.sql

REM Eliminar archivo temporal si existe
if exist "%TEMP_BACKUP%" del "%TEMP_BACKUP%"

REM Crear backup
docker exec ventas_db mysqldump -uroot -proot123 sistema_ventas 2>nul > "%TEMP_BACKUP%"

REM Esperar un momento
timeout /t 2 /nobreak >nul

REM Verificar que el archivo se creo
if not exist "%TEMP_BACKUP%" (
    echo ERROR: No se pudo crear el archivo de backup
    echo.
    echo Registro del error guardado en: %BACKUP_DIR%\error_log.txt
    echo %date% %time% - ERROR: Fallo al crear backup >> "%BACKUP_DIR%\error_log.txt"
    pause
    exit /b 1
)

REM Verificar tamano del archivo
for %%A in ("%TEMP_BACKUP%") do set TEMP_SIZE=%%~zA

REM Limpiar espacios de la variable
set TEMP_SIZE=%TEMP_SIZE: =%

echo DEBUG: Tamano del archivo temporal: [%TEMP_SIZE%] bytes

REM Verificar que el tamano no este vacio
if "%TEMP_SIZE%"=="" (
    echo ERROR: No se pudo obtener el tamano del archivo
    echo.
    echo Registro del error guardado en: %BACKUP_DIR%\error_log.txt
    echo %date% %time% - ERROR: No se pudo obtener tamano del archivo >> "%BACKUP_DIR%\error_log.txt"
    del "%TEMP_BACKUP%" 2>nul
    pause
    exit /b 1
)

REM Verificar que sea un numero valido comparando con 1000
set /a TEST_SIZE=%TEMP_SIZE% 2>nul

echo DEBUG: TEST_SIZE = [%TEST_SIZE%]
echo DEBUG: Comparando %TEST_SIZE% con 1000

REM Cambiar logica: verificar que SEA mayor o igual a 1000
if %TEST_SIZE% GEQ 1000 (
    echo OK - Archivo temporal creado correctamente (%TEMP_SIZE% bytes)
    goto :MoverArchivo
)

REM Si llega aqui, es porque es menor a 1000
echo ERROR: El backup esta vacio o incompleto (%TEMP_SIZE% bytes)
echo.
echo Registro del error guardado en: %BACKUP_DIR%\error_log.txt
echo %date% %time% - ERROR: Backup vacio o incompleto (%TEMP_SIZE% bytes) >> "%BACKUP_DIR%\error_log.txt"
del "%TEMP_BACKUP%" 2>nul
pause
exit /b 1

:MoverArchivo

REM Mover archivo a Google Drive
echo DEBUG: Moviendo de: %TEMP_BACKUP%
echo DEBUG: Moviendo a: %BACKUP_DIR%\%BACKUP_FILE%

move /Y "%TEMP_BACKUP%" "%BACKUP_DIR%\%BACKUP_FILE%"
set MOVE_ERROR=%errorlevel%

echo DEBUG: Resultado del move: %MOVE_ERROR%

REM Verificar que se movio correctamente
if not exist "%BACKUP_DIR%\%BACKUP_FILE%" (
    echo ERROR: No se pudo mover el archivo a Google Drive
    echo DEBUG: El archivo no existe en el destino
    echo.
    echo Registro del error guardado en: %BACKUP_DIR%\error_log.txt
    echo %date% %time% - ERROR: Fallo al mover archivo a Google Drive >> "%BACKUP_DIR%\error_log.txt"
    del "%TEMP_BACKUP%" 2>nul
    pause
    exit /b 1
)

REM Backup exitoso
echo OK - Backup completado exitosamente
echo.
echo Archivo: %BACKUP_FILE%
echo Ubicacion: %BACKUP_DIR%

REM Obtener tamano del archivo final
for %%A in ("%BACKUP_DIR%\%BACKUP_FILE%") do set SIZE=%%~zA
call echo Tamano: %%SIZE%% bytes

REM Registrar backup exitoso
call echo %%date%% %%time%% - EXITO: Backup creado - %BACKUP_FILE% (%%SIZE%% bytes) >> "%BACKUP_DIR%\backup_log.txt"

REM Limpiar backups antiguos (mantener ultimos 6 meses)
echo.
echo [3/3] Limpiando backups antiguos...
forfiles /P "%BACKUP_DIR%" /M backup_ventas_*.sql /D -180 /C "cmd /c del @path" 2>nul
if %errorlevel% equ 0 (
    echo OK - Backups antiguos eliminados
) else (
    echo OK - No hay backups antiguos para eliminar
)

echo.
echo ========================================
echo   BACKUP COMPLETADO EXITOSAMENTE
echo ========================================
echo.
echo El backup se guardo en Google Drive.
echo Se sincronizara automaticamente con la nube.
echo.
echo Puedes cerrar esta ventana.
echo ========================================
echo.

REM Esperar 10 segundos antes de cerrar
timeout /t 10 /nobreak >nul
exit
