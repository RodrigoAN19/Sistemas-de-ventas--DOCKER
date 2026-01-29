# ❓ PREGUNTAS FRECUENTES - INSTALACIÓN EN OTRA PC
## Respuestas para el Usuario Final

---

## 1. ¿EL PROYECTO CORRERÁ PERFECTAMENTE EN OTRA MÁQUINA?

### ✅ **SÍ, funcionará perfectamente** siempre que:

1. **La otra PC tenga Docker Desktop instalado**
   - Es el ÚNICO requisito obligatorio
   - Windows 10/11 (64 bits)
   - 8 GB RAM mínimo

2. **Descargues/clones el proyecto completo**
   - Desde GitHub
   - O copies la carpeta completa

3. **Ejecutes `INICIAR_SISTEMA.bat`**
   - Docker descargará las imágenes necesarias (primera vez)
   - Creará los contenedores automáticamente
   - Creará los volumes automáticamente
   - ¡Listo para usar!

---

## 2. ¿QUÉ PASA CON LOS DATOS?

### 🔄 **Primera Instalación (PC Nueva)**

**Escenario 1: Sin datos previos**
```
1. Descargas el proyecto de GitHub
2. Ejecutas INICIAR_SISTEMA.bat
3. El sistema inicia con datos de ejemplo
4. Empiezas a usarlo desde cero
```

**Escenario 2: Con datos de otra PC**
```
1. Descargas el proyecto de GitHub
2. Ejecutas INICIAR_SISTEMA.bat (inicia con datos de ejemplo)
3. Copias el backup de la PC antigua
4. Ejecutas RESTAURAR_BACKUP.bat
5. Seleccionas el archivo de backup
6. ¡Listo! Tienes todos los datos de la PC antigua
```

---

## 3. ¿CÓMO FUNCIONA EL BACKUP AUTOMÁTICO EN OTRA PC?

### 📋 **Configuración en la PC Nueva**

#### **Opción A: CON Google Drive (Recomendado)**

**Paso 1: Instalar Google Drive Desktop**
```
1. Descarga: https://www.google.com/drive/download/
2. Instala normalmente
3. Inicia sesión con TU cuenta de Google
   (Puede ser la misma cuenta o una nueva)
```

**Paso 2: Crear la Carpeta de Backups**
```
1. Abre Google Drive en el explorador
2. Ve a "Mi unidad"
3. Crea una carpeta: Backups_Licoreria_Cueva
```

**Paso 3: Verificar la Ruta**
```
Google Drive puede estar en:
- G:\Mi unidad\Backups_Licoreria_Cueva
- C:\Users\NombreUsuario\Google Drive\Backups_Licoreria_Cueva
- Otra ubicación

Anota la ruta exacta
```

**Paso 4: Configurar los Scripts**
```
Si tu Google Drive NO está en G:\Mi unidad\:

1. Abre con Bloc de notas:
   - BACKUP_AUTOMATICO.bat
   - RESTAURAR_BACKUP.bat
   - PROBAR_BACKUP.bat

2. Busca la línea 10:
   set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva

3. Cámbiala por tu ruta:
   set BACKUP_DIR=C:\Users\TuNombre\Google Drive\Backups_Licoreria_Cueva

4. Guarda los archivos
```

**Paso 5: Probar el Backup**
```
1. Doble clic en: PROBAR_BACKUP.bat
2. Debe decir: "PRUEBA COMPLETADA"
3. Verifica que se creó el archivo en Google Drive
```

**Paso 6: Configurar Backup Mensual Automático**
```
1. Windows + R
2. taskschd.msc
3. Crear tarea básica
4. Nombre: Backup Sistema Ventas
5. Desencadenador: Mensual, día 1, 02:00 AM
6. Acción: BACKUP_AUTOMATICO.bat
```

---

#### **Opción B: SIN Google Drive (Solo Backups Locales)**

**Paso 1: Modificar los Scripts**
```
1. Abre con Bloc de notas:
   - BACKUP_AUTOMATICO.bat
   - RESTAURAR_BACKUP.bat

2. Busca la línea 10:
   set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva

3. Cámbiala por una carpeta local:
   set BACKUP_DIR=C:\Backups_Sistema_Ventas

4. Guarda los archivos
```

**Paso 2: Crear la Carpeta**
```
1. Abre el Explorador de Archivos
2. Ve a C:\
3. Crea una carpeta: Backups_Sistema_Ventas
```

**Paso 3: Configurar Backup Mensual**
```
Igual que con Google Drive (taskschd.msc)
```

**⚠️ IMPORTANTE:**
```
Sin Google Drive:
- Los backups SOLO están en la PC
- Si formateas, pierdes los backups
- Debes copiar manualmente a USB cada mes
```

---

## 4. ¿NECESITO LA MISMA CUENTA DE GOOGLE DRIVE?

### 🔑 **NO, puedes usar cualquier cuenta**

**Opción 1: Misma cuenta en todas las PCs**
```
Ventajas:
✅ Todos los backups en un solo lugar
✅ Fácil de administrar
✅ Puedes ver backups de todas las PCs

Desventajas:
⚠️ Si alguien tiene acceso, ve todos los backups
```

**Opción 2: Cuenta diferente por PC**
```
Ventajas:
✅ Backups separados por PC
✅ Más seguro

Desventajas:
⚠️ Debes administrar múltiples cuentas
⚠️ Más difícil de consolidar
```

**Opción 3: Cuenta del negocio (Recomendado)**
```
Ventajas:
✅ Cuenta exclusiva para el negocio
✅ No mezclas con datos personales
✅ Puedes compartir con administrador

Recomendación:
Crea una cuenta: licoreria.cueva.backups@gmail.com
```

---

## 5. RESUMEN: PASOS PARA INSTALAR EN OTRA PC

### 📋 **Checklist Completo**

#### **Antes de Empezar**
- [ ] PC con Windows 10/11 (64 bits)
- [ ] 8 GB RAM mínimo
- [ ] 20 GB espacio en disco
- [ ] Conexión a Internet (solo para instalación)

#### **Instalación Básica**
- [ ] 1. Instalar Docker Desktop
- [ ] 2. Descargar proyecto de GitHub
- [ ] 3. Ejecutar `INICIAR_SISTEMA.bat`
- [ ] 4. Abrir navegador en `http://localhost:3000`
- [ ] 5. Login con admin/admin123
- [ ] ✅ **Sistema funcionando**

#### **Configuración de Backups (Opcional)**
- [ ] 6. Instalar Google Drive Desktop
- [ ] 7. Crear carpeta `Backups_Licoreria_Cueva`
- [ ] 8. Verificar ruta de Google Drive
- [ ] 9. Configurar ruta en scripts (si es necesario)
- [ ] 10. Ejecutar `PROBAR_BACKUP.bat`
- [ ] 11. Configurar tarea programada (taskschd.msc)
- [ ] ✅ **Backups automáticos configurados**

#### **Migración de Datos (Si vienes de otra PC)**
- [ ] 12. Copiar backup de PC antigua
- [ ] 13. Ejecutar `RESTAURAR_BACKUP.bat`
- [ ] 14. Seleccionar archivo de backup
- [ ] 15. Confirmar restauración
- [ ] ✅ **Datos migrados**

#### **Arranque Automático (Opcional)**
- [ ] 16. Crear acceso directo en escritorio
- [ ] 17. Crear acceso directo en Inicio (shell:startup)
- [ ] ✅ **Sistema inicia automáticamente**

---

## 6. ESCENARIOS COMUNES

### 📌 **Escenario 1: PC de Desarrollo → PC de Producción**

```
PC de Desarrollo (tu PC actual):
1. Sube el proyecto a GitHub
2. Ejecuta BACKUP_AUTOMATICO.bat
3. Descarga el backup a USB

PC de Producción (PC del negocio):
1. Instala Docker Desktop
2. Clona el proyecto de GitHub
3. Ejecuta INICIAR_SISTEMA.bat
4. Copia el backup a la carpeta de backups
5. Ejecuta RESTAURAR_BACKUP.bat
6. Configura Google Drive (opcional)
7. Configura tarea programada
8. ¡Listo para producción!
```

---

### 📌 **Escenario 2: Cambio de PC (Migración Completa)**

```
PC Antigua:
1. Ejecuta BACKUP_AUTOMATICO.bat
2. Copia el archivo .sql a USB
3. Anota usuarios y contraseñas

PC Nueva:
1. Instala Docker Desktop
2. Descarga proyecto de GitHub
3. Ejecuta INICIAR_SISTEMA.bat
4. Copia backup de USB a carpeta de backups
5. Ejecuta RESTAURAR_BACKUP.bat
6. Verifica que todos los datos estén
7. Configura backups automáticos
8. ¡Migración completa!
```

---

### 📌 **Escenario 3: Múltiples Sucursales**

```
Sucursal 1:
- Instala sistema completo
- Configura backups con cuenta: sucursal1@negocio.com

Sucursal 2:
- Instala sistema completo
- Configura backups con cuenta: sucursal2@negocio.com

Administrador Central:
- Tiene acceso a ambas cuentas de Google Drive
- Puede ver backups de todas las sucursales
- Puede consolidar datos si es necesario
```

---

## 7. SOLUCIÓN DE PROBLEMAS

### ❌ **"Docker no está instalado"**
```
Solución:
1. Descarga Docker Desktop
2. Instala
3. Reinicia la PC
4. Abre Docker Desktop
5. Espera a que inicie
6. Vuelve a ejecutar INICIAR_SISTEMA.bat
```

### ❌ **"No se puede conectar a la base de datos"**
```
Solución:
1. Verifica que Docker esté corriendo
2. Ejecuta: docker-compose down
3. Ejecuta: docker-compose up -d
4. Espera 30 segundos
5. Refresca el navegador
```

### ❌ **"Carpeta de backups no encontrada"**
```
Solución:
1. Verifica que Google Drive esté instalado
2. Verifica que la carpeta exista
3. Verifica la ruta en los scripts
4. Edita BACKUP_AUTOMATICO.bat línea 10
5. Cambia la ruta por la correcta
```

### ❌ **"Los datos no se guardan"**
```
Esto NO debería pasar porque usamos Docker Volumes.

Si pasa:
1. Verifica que el volume existe:
   docker volume ls
   
2. Deberías ver:
   sitemasdeventasandre_db_data
   
3. Si no existe, el sistema lo creará automáticamente
```

---

## 8. CONTACTO Y SOPORTE

### 📧 **Soporte Técnico**
- Email: soporte@licoreria-cueva.com
- WhatsApp: +51 999 999 999

### 📚 **Documentación**
- `INSTALACION_COMPLETA.md` - Guía paso a paso
- `GUIA_EMPRESARIAL.md` - Configuración avanzada
- `EXPLICACION_VOLUMES.md` - Persistencia de datos

### 🐛 **Reportar Problemas**
- GitHub Issues: https://github.com/TU_USUARIO/sistema-ventas/issues

---

## ✅ CONCLUSIÓN

**Respuestas Rápidas:**

1. **¿Funcionará en otra PC?**
   → ✅ SÍ, solo necesitas Docker Desktop

2. **¿Necesito Google Drive?**
   → ⚠️ NO es obligatorio, pero SÍ recomendado

3. **¿Necesito la misma cuenta de Google?**
   → ❌ NO, puedes usar cualquier cuenta

4. **¿Se pierden los datos al cambiar de PC?**
   → ❌ NO, si haces backup y restauras

5. **¿Es difícil instalar?**
   → ❌ NO, son 3 pasos: Docker, Descargar, Ejecutar

---

**¡El sistema está diseñado para ser fácil de instalar y usar!** 🚀
