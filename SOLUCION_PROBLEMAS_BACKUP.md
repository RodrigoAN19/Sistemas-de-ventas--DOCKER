# 🔧 SOLUCIÓN DE PROBLEMAS - BACKUPS
## Sistema de Ventas - Licorería Cueva

---

## ❌ PROBLEMA: El backup no se guarda

### ✅ **SOLUCIÓN PASO A PASO**

#### 1. Verificar la Ruta de Google Drive

Google Drive puede instalarse en diferentes ubicaciones:

**Opción A: Unidad G:\ (Tu caso)**
```
G:\Mi unidad\Backups_Licoreria_Cueva\
```

**Opción B: Carpeta de usuario**
```
C:\Users\TuNombre\Google Drive\Backups_Licoreria_Cueva\
```

**Opción C: Otra unidad**
```
D:\Google Drive\Backups_Licoreria_Cueva\
```

#### 2. Encontrar tu Ruta de Google Drive

**Método 1: Explorador de Archivos**
1. Abre el Explorador de Archivos
2. Busca en el panel izquierdo "Google Drive"
3. Haz clic derecho → "Propiedades"
4. Copia la ruta completa

**Método 2: Icono de Google Drive**
1. Haz clic en el icono de Google Drive en la barra de tareas
2. Click en el engranaje (⚙️)
3. Click en "Preferencias"
4. Verás la ubicación de la carpeta

#### 3. Actualizar los Scripts

Una vez que sepas tu ruta, edita estos archivos:

**BACKUP_AUTOMATICO.bat:**
```batch
Línea 10:
set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva
              ↑
              Cambia esto por tu ruta
```

**RESTAURAR_BACKUP.bat:**
```batch
Línea 9:
set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva
              ↑
              Cambia esto por tu ruta
```

#### 4. Crear la Carpeta de Backups

1. Abre Google Drive en el explorador
2. Navega a "Mi unidad"
3. Crea una carpeta llamada: `Backups_Licoreria_Cueva`
4. Verifica que la carpeta exista

#### 5. Probar el Backup

1. Haz doble clic en: `PROBAR_BACKUP.bat`
2. Este script verificará:
   - ✅ Que la carpeta existe
   - ✅ Que Docker está corriendo
   - ✅ Que el contenedor está activo
   - ✅ Que el backup se crea correctamente
   - ✅ Que el archivo se guarda en Google Drive

---

## 🔍 DIAGNÓSTICO DE ERRORES

### Error 1: "Carpeta NO encontrada"

**Causa:** La ruta en el script no coincide con tu instalación de Google Drive

**Solución:**
1. Verifica la ruta real de Google Drive (ver paso 2 arriba)
2. Edita `BACKUP_AUTOMATICO.bat` línea 10
3. Edita `RESTAURAR_BACKUP.bat` línea 9
4. Guarda los archivos
5. Vuelve a intentar

### Error 2: "Docker no está corriendo"

**Causa:** Docker Desktop no está iniciado

**Solución:**
1. Abre Docker Desktop
2. Espera 30 segundos a que inicie
3. Vuelve a ejecutar el backup

### Error 3: "Contenedor ventas_db no está corriendo"

**Causa:** El sistema no está iniciado

**Solución:**
1. Ejecuta `INICIAR_SISTEMA.bat`
2. Espera 15 segundos
3. Vuelve a ejecutar el backup

### Error 4: "Archivo muy pequeño"

**Causa:** El backup está vacío o incompleto

**Solución:**
1. Verifica que haya ventas en el sistema
2. Verifica que Docker tenga suficiente espacio
3. Revisa los logs de error en:
   ```
   G:\Mi unidad\Backups_Licoreria_Cueva\error_log.txt
   ```

### Error 5: "Acceso denegado"

**Causa:** Permisos insuficientes

**Solución:**
1. Ejecuta el script como Administrador:
   - Clic derecho en `BACKUP_AUTOMATICO.bat`
   - "Ejecutar como administrador"

---

## 📝 VERIFICACIÓN MANUAL

### Paso 1: Verificar Docker

```powershell
docker ps
```

Deberías ver:
```
CONTAINER ID   IMAGE     COMMAND   STATUS
xxxxx          mysql:8.0 ...       Up 5 minutes
```

### Paso 2: Verificar Base de Datos

```powershell
docker exec ventas_db mysql -uroot -proot123 -e "SHOW DATABASES;"
```

Deberías ver:
```
+--------------------+
| Database           |
+--------------------+
| sistema_ventas     |
+--------------------+
```

### Paso 3: Crear Backup Manual

```powershell
docker exec ventas_db mysqldump -uroot -proot123 sistema_ventas > test_backup.sql
```

### Paso 4: Verificar Archivo

```powershell
dir test_backup.sql
```

Si el archivo existe y tiene más de 1 KB, el backup funciona.

---

## 🎯 CONFIGURACIÓN CORRECTA

### Tu Configuración Actual

```
Google Drive: G:\Mi unidad\
Carpeta de Backups: G:\Mi unidad\Backups_Licoreria_Cueva\
```

### Scripts Actualizados

**BACKUP_AUTOMATICO.bat (línea 10):**
```batch
set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva
```

**RESTAURAR_BACKUP.bat (línea 9):**
```batch
set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva
```

### Verificación Final

1. Ejecuta `PROBAR_BACKUP.bat`
2. Deberías ver:
   ```
   [1/5] Verificando carpeta... OK
   [2/5] Verificando Docker... OK
   [3/5] Verificando contenedor... OK
   [4/5] Creando backup... OK
   [5/5] Verificando archivo... OK
   
   PRUEBA COMPLETADA
   ```

---

## 📞 AYUDA ADICIONAL

Si después de seguir estos pasos aún tienes problemas:

1. **Captura de pantalla del error:**
   - Ejecuta `PROBAR_BACKUP.bat`
   - Toma captura del error

2. **Verifica la ruta:**
   - Abre el Explorador de Archivos
   - Navega a `G:\Mi unidad\`
   - Verifica que veas la carpeta `Backups_Licoreria_Cueva`

3. **Logs de error:**
   - Revisa: `G:\Mi unidad\Backups_Licoreria_Cueva\error_log.txt`
   - Copia el contenido

---

## ✅ CHECKLIST DE VERIFICACIÓN

Antes de ejecutar el backup, verifica:

- [ ] Docker Desktop está corriendo
- [ ] El sistema está iniciado (`INICIAR_SISTEMA.bat`)
- [ ] Google Drive está sincronizando
- [ ] La carpeta `Backups_Licoreria_Cueva` existe en `G:\Mi unidad\`
- [ ] Los scripts tienen la ruta correcta (`G:\Mi unidad\...`)
- [ ] Hay espacio suficiente en el disco G:\

---

**¡Con estos pasos el backup debería funcionar correctamente!** 🎉
