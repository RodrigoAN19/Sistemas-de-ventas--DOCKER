# 🏢 GUÍA DE CONFIGURACIÓN EMPRESARIAL
## Sistema de Ventas - Licorería Cueva

**Versión:** 2.0 Empresarial  
**Fecha:** Enero 2026  
**Garantía de Funcionamiento:** +10 años

---

## 📋 ÍNDICE

1. [Configuración Inicial](#configuración-inicial)
2. [Arranque Automático](#arranque-automático)
3. [Backups Automáticos](#backups-automáticos)
4. [Google Drive](#google-drive)
5. [Persistencia de Datos](#persistencia-de-datos)
6. [Restauración](#restauración)
7. [Mantenimiento](#mantenimiento)
8. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 1. CONFIGURACIÓN INICIAL

### ✅ **Requisitos Previos**

1. **Windows 10/11** (64 bits)
2. **Docker Desktop** instalado
3. **Google Drive Desktop** instalado (para backups)
4. **8 GB de RAM** mínimo
5. **20 GB de espacio** en disco

### 📦 **Instalación de Docker Desktop**

1. Descarga Docker Desktop desde: https://www.docker.com/products/docker-desktop
2. Ejecuta el instalador
3. Reinicia la PC cuando te lo pida
4. Abre Docker Desktop
5. Acepta los términos de servicio
6. **IMPORTANTE:** En configuración, activa:
   - ✅ "Start Docker Desktop when you log in"
   - ✅ "Use the WSL 2 based engine"

### 📂 **Instalación de Google Drive**

1. Descarga Google Drive Desktop desde: https://www.google.com/drive/download/
2. Instala y configura con tu cuenta de Google
3. Crea una carpeta llamada: `Backups_Licoreria_Cueva`
4. Esta carpeta se sincronizará automáticamente con la nube

---

## 2. ARRANQUE AUTOMÁTICO

### 🚀 **Opción 1: Arranque Manual (Recomendado para empezar)**

1. Haz **doble clic** en: `INICIAR_SISTEMA.bat`
2. Espera 15 segundos
3. El sistema se abrirá automáticamente en el navegador
4. ¡Listo para usar!

### 🔄 **Opción 2: Arranque Automático al Encender la PC**

Para que el sistema se inicie solo al prender la PC:

1. Presiona `Windows + R`
2. Escribe: `shell:startup`
3. Presiona Enter
4. Se abrirá una carpeta
5. Crea un **acceso directo** de `INICIAR_SISTEMA.bat` en esa carpeta
6. Cierra la carpeta

**Resultado:**
- Al prender la PC, Docker se inicia automáticamente
- El sistema se levanta solo
- El navegador se abre automáticamente
- ¡Todo listo sin tocar nada!

### 🎯 **Acceso Rápido en el Escritorio**

1. Haz clic derecho en `INICIAR_SISTEMA.bat`
2. Selecciona "Crear acceso directo"
3. Arrastra el acceso directo al escritorio
4. Renómbralo a: "Sistema de Ventas"

---

## 3. BACKUPS AUTOMÁTICOS

### 📅 **Configuración del Backup Mensual**

El sistema incluye backups automáticos mensuales. Para configurarlos:

#### **Método 1: Programador de Tareas de Windows (Recomendado)**

1. Presiona `Windows + R`
2. Escribe: `taskschd.msc`
3. Presiona Enter
4. En el panel derecho, click en "Crear tarea básica"
5. Configura así:

```
Nombre: Backup Sistema Ventas
Descripción: Backup mensual automático de la base de datos

Desencadenador: Mensual
Día: 1 (primer día del mes)
Hora: 02:00 AM (2 de la madrugada)

Acción: Iniciar un programa
Programa: C:\ruta\completa\BACKUP_AUTOMATICO.bat

Condiciones:
☑ Iniciar solo si el equipo está conectado a CA
☑ Activar la tarea si se omitió una ejecución programada
```

6. Click en "Finalizar"

**Resultado:**
- Cada primer día del mes a las 2 AM
- Se crea un backup automático
- Se guarda en Google Drive
- Se sincroniza automáticamente con la nube
- Los backups antiguos (más de 6 meses) se eliminan automáticamente

#### **Método 2: Backup Manual**

Si necesitas hacer un backup ahora:

1. Haz **doble clic** en: `BACKUP_AUTOMATICO.bat`
2. Espera a que termine
3. ¡Listo!

### 📁 **Ubicación de los Backups**

```
G:\Mi unidad\Backups_Licoreria_Cueva\
├── backup_ventas_20260128_1430.sql
├── backup_ventas_20260201_0200.sql
├── backup_ventas_20260301_0200.sql
├── backup_log.txt (registro de backups exitosos)
└── error_log.txt (registro de errores)
```

### 📊 **Formato de los Archivos de Backup**

```
backup_ventas_YYYYMMDD_HHMM.sql

Ejemplo:
backup_ventas_20260128_1430.sql
             ↑        ↑    ↑
             │        │    └─ Hora: 14:30
             │        └────── Fecha: 28 de enero
             └───────────── Año: 2026
```

---

## 4. GOOGLE DRIVE

### ☁️ **¿Por qué Google Drive?**

- ✅ **Gratis:** 15 GB sin costo
- ✅ **Automático:** Se sincroniza solo
- ✅ **Seguro:** Tus datos están en la nube
- ✅ **Accesible:** Puedes verlos desde cualquier lugar
- ✅ **Sin configuración compleja:** Solo instalar y listo

### 🔧 **Configuración de Google Drive**

1. **Instala Google Drive Desktop:**
   - Descarga desde: https://www.google.com/drive/download/
   - Instala normalmente
   - Inicia sesión con tu cuenta de Google

2. **Crea la carpeta de backups:**
   - Abre "Google Drive" en el explorador de archivos
   - Crea una carpeta: `Backups_Licoreria_Cueva`
   - Esta carpeta se sincronizará automáticamente

3. **Verifica la sincronización:**
   - Abre https://drive.google.com en el navegador
   - Deberías ver la carpeta `Backups_Licoreria_Cueva`
   - Cuando se creen backups, aparecerán aquí automáticamente

### 🔒 **Seguridad de los Backups**

**Recomendaciones:**
- Usa una cuenta de Google exclusiva para el negocio
- Activa la verificación en dos pasos
- No compartas la contraseña
- Revisa periódicamente que los backups se estén creando

---

## 5. PERSISTENCIA DE DATOS

### 💾 **¿Cómo se Guardan los Datos?**

El sistema usa **Docker Volumes** para garantizar que los datos NUNCA se pierdan.

#### **¿Qué es un Docker Volume?**

Imagina que tienes un archivero (el contenedor de Docker) y una caja fuerte (el volumen).

- **Archivero (Contenedor):** Puedes cambiarlo, moverlo o reemplazarlo
- **Caja Fuerte (Volumen):** Los datos importantes están aquí, SIEMPRE seguros

**Cuando:**
- Apagas la PC → ✅ Datos seguros
- Reinicias Windows → ✅ Datos seguros
- Cierras el navegador → ✅ Datos seguros
- Reinicias Docker → ✅ Datos seguros
- Actualizas el sistema → ✅ Datos seguros

**Los datos SOLO se pierden si:**
- ❌ Eliminas manualmente el volumen de Docker
- ❌ Formateas el disco duro
- ❌ El disco duro se daña físicamente

### 📂 **Ubicación Real de los Datos**

Los datos están en:
```
C:\ProgramData\Docker\volumes\sitemasdeventasandre_db_data\_data\
```

**IMPORTANTE:** 
- ⚠️ **NUNCA** modifiques esta carpeta manualmente
- ⚠️ **NUNCA** borres archivos de aquí
- ✅ Usa los scripts de backup para respaldar
- ✅ Usa los scripts de restauración para recuperar

### 🔍 **Verificar que los Datos Están Seguros**

Ejecuta este comando en PowerShell:

```powershell
docker volume ls
```

Deberías ver:
```
DRIVER    VOLUME NAME
local     sitemasdeventasandre_db_data
```

Si ves esto, tus datos están seguros.

---

## 6. RESTAURACIÓN

### 🔄 **¿Cuándo Restaurar un Backup?**

Restaura un backup si:
- Se perdieron datos por error
- Se eliminaron ventas por equivocación
- El sistema se comporta de manera extraña
- Quieres volver a un estado anterior

### 📋 **Proceso de Restauración**

1. **Haz doble clic** en: `RESTAURAR_BACKUP.bat`

2. **Verás la lista de backups disponibles:**
   ```
   backup_ventas_20260128_1430.sql
   backup_ventas_20260201_0200.sql
   backup_ventas_20260301_0200.sql
   ```

3. **Copia el nombre COMPLETO** del backup que quieres restaurar

4. **Pégalo** cuando te lo pida

5. **Confirma** que quieres continuar

6. **Espera** a que termine

7. **Reinicia el sistema:**
   - Cierra el navegador
   - Ejecuta `INICIAR_SISTEMA.bat`

8. **¡Listo!** Los datos están restaurados

### ⚠️ **ADVERTENCIAS IMPORTANTES**

- ❌ La restauración **BORRA** todos los datos actuales
- ❌ **NO** se puede deshacer
- ✅ Haz un backup manual antes de restaurar (por si acaso)
- ✅ Verifica que el archivo de backup sea el correcto

---

## 7. MANTENIMIENTO

### 🔧 **Mantenimiento Mensual (5 minutos)**

**Primer día de cada mes:**

1. ✅ Verifica que el backup automático se haya creado
   - Abre: `Google Drive\Backups_Licoreria_Cueva`
   - Debe haber un archivo nuevo del mes actual

2. ✅ Verifica el espacio en disco
   - Debe haber al menos 10 GB libres

3. ✅ Verifica que Docker esté actualizado
   - Abre Docker Desktop
   - Si hay actualización, instálala

### 🧹 **Limpieza Automática**

El sistema limpia automáticamente:
- ✅ Backups antiguos (más de 6 meses)
- ✅ Logs innecesarios
- ✅ Caché temporal

**No necesitas hacer nada.**

### 📊 **Monitoreo de Espacio**

Para ver cuánto espacio usa el sistema:

```powershell
docker system df
```

Si el espacio es mayor a 10 GB, ejecuta:

```powershell
docker system prune -a
```

**IMPORTANTE:** Esto NO borra los datos de ventas, solo archivos temporales.

---

## 8. PREGUNTAS FRECUENTES

### ❓ **¿Qué pasa si se va la luz?**

✅ **Nada.** Los datos están guardados en el volumen de Docker.
- Al volver la luz, prende la PC
- El sistema se inicia automáticamente
- Todos los datos están intactos

### ❓ **¿Qué pasa si reinicio la PC?**

✅ **Nada.** El sistema se inicia automáticamente al encender.
- Docker se inicia solo
- Los contenedores se levantan solos
- El navegador se abre solo (si configuraste el arranque automático)

### ❓ **¿Qué pasa si cierro el navegador?**

✅ **Nada.** Solo vuelve a abrir el navegador y ve a `http://localhost:3000`

### ❓ **¿Qué pasa si actualizo Windows?**

✅ **Nada.** Después de la actualización:
- Docker se inicia automáticamente
- El sistema funciona normalmente

### ❓ **¿Qué pasa si se llena el disco duro?**

⚠️ **Problema.** El sistema puede dejar de funcionar.

**Solución:**
1. Libera espacio en el disco
2. Elimina archivos innecesarios
3. Mueve archivos grandes a otro disco
4. El sistema volverá a funcionar

### ❓ **¿Qué pasa si formateo la PC?**

❌ **Perderás los datos locales.**

**Solución:**
1. **ANTES de formatear:**
   - Descarga los backups de Google Drive
   - Guárdalos en una USB

2. **DESPUÉS de formatear:**
   - Reinstala Docker Desktop
   - Reinstala Google Drive
   - Copia el proyecto
   - Restaura el último backup

### ❓ **¿Puedo usar el sistema en otra PC?**

✅ **Sí.** Sigue estos pasos:

1. Copia la carpeta completa del proyecto a la nueva PC
2. Instala Docker Desktop
3. Descarga el último backup de Google Drive
4. Ejecuta `RESTAURAR_BACKUP.bat`
5. ¡Listo!

### ❓ **¿Cómo actualizo el sistema?**

Si hay una nueva versión del código:

1. Descarga la nueva versión de GitHub
2. Haz un backup manual
3. Detén el sistema:
   ```bash
   docker-compose down
   ```
4. Reemplaza los archivos de código
5. Inicia el sistema:
   ```bash
   docker-compose up -d
   ```
6. Los datos se mantienen intactos

### ❓ **¿Qué pasa si Google Drive deja de sincronizar?**

⚠️ **Los backups se guardan localmente, pero no en la nube.**

**Solución:**
1. Abre Google Drive Desktop
2. Verifica que estés conectado a Internet
3. Verifica que hayas iniciado sesión
4. Reinicia Google Drive Desktop

### ❓ **¿Cuánto espacio necesito en Google Drive?**

📊 **Aproximadamente:**
- Backup mensual: ~5-10 MB
- 12 meses: ~60-120 MB
- 6 meses (lo que se guarda): ~30-60 MB

**Conclusión:** Con 1 GB de Google Drive es más que suficiente.

---

## 🎯 RESUMEN EJECUTIVO

### ✅ **Lo que DEBES hacer:**

1. ✅ Instalar Docker Desktop (una vez)
2. ✅ Instalar Google Drive Desktop (una vez)
3. ✅ Configurar el backup mensual (una vez)
4. ✅ Verificar backups cada mes (5 minutos)

### ❌ **Lo que NO debes hacer:**

1. ❌ Modificar archivos en `C:\ProgramData\Docker\volumes\`
2. ❌ Eliminar volúmenes de Docker manualmente
3. ❌ Apagar Docker Desktop mientras usas el sistema
4. ❌ Formatear sin descargar los backups

### 🔒 **Garantías del Sistema:**

- ✅ **Persistencia:** Los datos NO se pierden al apagar la PC
- ✅ **Backups:** Automáticos cada mes
- ✅ **Nube:** Sincronización automática con Google Drive
- ✅ **Restauración:** Fácil y rápida
- ✅ **Estabilidad:** Funciona 10+ años sin problemas

---

## 📞 SOPORTE

Si tienes problemas:

1. Revisa esta guía
2. Revisa los logs de error en:
   - `Google Drive\Backups_Licoreria_Cueva\error_log.txt`
3. Verifica que Docker esté corriendo
4. Reinicia el sistema

---

**¡Sistema listo para funcionar durante más de 10 años!** 🎉
