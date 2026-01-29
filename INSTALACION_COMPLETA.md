# 📦 GUÍA DE INSTALACIÓN COMPLETA
## Sistema de Ventas e Inventarios - Licorería Cueva

**Para:** Usuario Final (PC de Producción)  
**Versión:** 2.0 Empresarial  
**Garantía:** 10+ años de funcionamiento

---

## 📋 ÍNDICE

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación Paso a Paso](#instalación-paso-a-paso)
3. [Configuración de Backups](#configuración-de-backups)
4. [Arranque Automático](#arranque-automático)
5. [Primer Uso](#primer-uso)
6. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 1. REQUISITOS PREVIOS

### ✅ **Hardware Mínimo**

- **PC:** Windows 10/11 (64 bits)
- **RAM:** 8 GB mínimo
- **Disco:** 20 GB libres
- **Internet:** Solo para instalación inicial y backups en nube

### ✅ **Software Necesario**

Debes instalar estos programas ANTES de continuar:

1. **Docker Desktop** (OBLIGATORIO)
   - Descarga: https://www.docker.com/products/docker-desktop
   - Versión: Última disponible
   - Tiempo: 10-15 minutos

2. **Google Drive Desktop** (OPCIONAL pero RECOMENDADO)
   - Descarga: https://www.google.com/drive/download/
   - Solo si quieres backups en la nube
   - Tiempo: 5 minutos

3. **Git** (OPCIONAL)
   - Descarga: https://git-scm.com/downloads
   - Solo si vas a clonar desde GitHub
   - Tiempo: 5 minutos

---

## 2. INSTALACIÓN PASO A PASO

### 📥 **PASO 1: Descargar el Proyecto**

#### **Opción A: Desde GitHub (Recomendado)**

1. Abre una terminal (CMD o PowerShell)
2. Navega a donde quieres instalar:
   ```cmd
   cd "C:\Proyectos"
   ```
3. Clona el repositorio:
   ```cmd
   git clone https://github.com/TU_USUARIO/sistema-ventas.git
   cd sistema-ventas
   ```

#### **Opción B: Descarga ZIP**

1. Ve a: https://github.com/TU_USUARIO/sistema-ventas
2. Click en "Code" → "Download ZIP"
3. Extrae el ZIP en: `C:\Proyectos\sistema-ventas`

---

### 🐳 **PASO 2: Instalar Docker Desktop**

1. **Descarga Docker Desktop:**
   - https://www.docker.com/products/docker-desktop

2. **Ejecuta el instalador:**
   - Acepta los términos
   - Deja las opciones por defecto
   - **IMPORTANTE:** Marca "Use WSL 2 based engine"

3. **Reinicia la PC** cuando te lo pida

4. **Abre Docker Desktop:**
   - Acepta los términos de servicio
   - Espera a que inicie (puede tardar 1-2 minutos)

5. **Configura Docker para inicio automático:**
   - Click en el engranaje (⚙️) → Settings
   - General → ☑ "Start Docker Desktop when you log in"
   - Apply & Restart

---

### ☁️ **PASO 3: Configurar Google Drive (OPCIONAL)**

**⚠️ IMPORTANTE:** Solo si quieres backups automáticos en la nube.

1. **Descarga Google Drive Desktop:**
   - https://www.google.com/drive/download/

2. **Instala y configura:**
   - Inicia sesión con tu cuenta de Google
   - Selecciona "Sincronizar Mi unidad con este equipo"
   - Espera a que termine la sincronización inicial

3. **Crea la carpeta de backups:**
   - Abre el Explorador de Archivos
   - Ve a: `G:\Mi unidad\` (o donde esté Google Drive)
   - Crea una carpeta: `Backups_Licoreria_Cueva`

4. **Verifica la ruta:**
   - Anota la ruta completa, ejemplo:
     - `G:\Mi unidad\Backups_Licoreria_Cueva`
     - `C:\Users\TuNombre\Google Drive\Backups_Licoreria_Cueva`

---

### 🚀 **PASO 4: Iniciar el Sistema por Primera Vez**

1. **Abre la carpeta del proyecto:**
   ```
   C:\Proyectos\sistema-ventas
   ```

2. **Haz doble clic en:**
   ```
   INICIAR_SISTEMA.bat
   ```

3. **Espera 30-60 segundos** (primera vez tarda más porque descarga imágenes de Docker)

4. **Verás algo como:**
   ```
   ========================================
     INICIANDO SISTEMA DE VENTAS
   ========================================
   
   [1/4] Verificando Docker... OK
   [2/4] Iniciando servicios...
   Creating network...
   Creating volume...
   Pulling backend...
   Pulling frontend...
   Pulling db...
   Creating ventas_db...
   Creating ventas_backend...
   Creating ventas_frontend...
   
   [3/4] Esperando a que el sistema este listo...
   [4/4] Abriendo el sistema en el navegador...
   
   ========================================
     SISTEMA LISTO PARA USAR
   ========================================
   ```

5. **El navegador se abrirá automáticamente** en: `http://localhost:3000`

---

### 🔐 **PASO 5: Primer Inicio de Sesión**

1. **En el navegador verás la pantalla de login:**
   ```
   Usuario: admin
   Contraseña: admin123
   ```

2. **Click en "Iniciar Sesión"**

3. **¡Listo!** Ya estás dentro del sistema

---

## 3. CONFIGURACIÓN DE BACKUPS

### 📅 **PASO 1: Verificar Ruta de Google Drive**

**⚠️ IMPORTANTE:** Solo si instalaste Google Drive en el Paso 3.

1. **Abre el Explorador de Archivos**

2. **Busca tu carpeta de Google Drive:**
   - Puede estar en: `G:\Mi unidad\`
   - O en: `C:\Users\TuNombre\Google Drive\`

3. **Verifica que existe:**
   ```
   [Tu ruta]\Backups_Licoreria_Cueva\
   ```

4. **Anota la ruta completa** (la necesitarás en el siguiente paso)

---

### 🔧 **PASO 2: Configurar Ruta en Scripts**

**Solo si tu Google Drive NO está en `G:\Mi unidad\`**

1. **Abre con Bloc de notas:**
   - `BACKUP_AUTOMATICO.bat`
   - `RESTAURAR_BACKUP.bat`
   - `PROBAR_BACKUP.bat`

2. **Busca la línea 10 (aproximadamente):**
   ```batch
   set BACKUP_DIR=G:\Mi unidad\Backups_Licoreria_Cueva
   ```

3. **Cámbiala por tu ruta:**
   ```batch
   set BACKUP_DIR=C:\Users\TuNombre\Google Drive\Backups_Licoreria_Cueva
   ```

4. **Guarda los archivos**

---

### 🧪 **PASO 3: Probar el Backup**

1. **Haz doble clic en:**
   ```
   PROBAR_BACKUP.bat
   ```

2. **Deberías ver:**
   ```
   ========================================
     PRUEBA DE BACKUP
   ========================================
   
   [1/5] Verificando carpeta... OK
   [2/5] Verificando Docker... OK
   [3/5] Verificando contenedor... OK
   [4/5] Creando backup... OK
   [5/5] Verificando archivo... OK
   
   ========================================
     PRUEBA COMPLETADA
   ========================================
   ```

3. **Verifica que se creó el archivo:**
   - Abre: `[Tu ruta]\Backups_Licoreria_Cueva\`
   - Deberías ver: `backup_PRUEBA_20260128_XXXXXX.sql`

---

### 📆 **PASO 4: Configurar Backup Mensual Automático**

1. **Presiona:** `Windows + R`

2. **Escribe:** `taskschd.msc`

3. **Presiona:** Enter

4. **En el panel derecho, click en:** "Crear tarea básica"

5. **Configura así:**

   **Página 1 - Nombre:**
   ```
   Nombre: Backup Sistema Ventas
   Descripción: Backup mensual automático de la base de datos
   ```
   Click en "Siguiente"

   **Página 2 - Desencadenador:**
   ```
   ○ Diariamente
   ○ Semanalmente
   ● Mensualmente  ← Selecciona esta
   ```
   Click en "Siguiente"

   **Página 3 - Configuración mensual:**
   ```
   Meses: [Selecciona todos]
   Días: 1  (primer día del mes)
   Hora: 02:00:00  (2 de la madrugada)
   ```
   Click en "Siguiente"

   **Página 4 - Acción:**
   ```
   ● Iniciar un programa  ← Selecciona esta
   ```
   Click en "Siguiente"

   **Página 5 - Programa:**
   ```
   Programa o script: C:\Proyectos\sistema-ventas\BACKUP_AUTOMATICO.bat
   
   (Usa el botón "Examinar" para encontrarlo)
   ```
   Click en "Siguiente"

   **Página 6 - Resumen:**
   ```
   ☑ Abrir el cuadro de diálogo Propiedades al hacer clic en Finalizar
   ```
   Click en "Finalizar"

6. **En la ventana de Propiedades que se abre:**

   **Pestaña "General":**
   ```
   ☑ Ejecutar tanto si el usuario inició sesión como si no
   ☑ Ejecutar con los privilegios más altos
   ```

   **Pestaña "Condiciones":**
   ```
   ☑ Iniciar solo si el equipo está conectado a CA
   ☐ Detener si el equipo deja de estar conectado a CA
   ☑ Activar la tarea si se omitió una ejecución programada
   ```

   **Pestaña "Configuración":**
   ```
   ☑ Permitir que la tarea se ejecute a petición
   ☑ Ejecutar la tarea lo antes posible después de omitir un inicio programado
   ☑ Si la tarea falla, reiniciar cada: 1 minuto
   Intentar reiniciar hasta: 3 veces
   ```

7. **Click en "Aceptar"**

8. **Ingresa tu contraseña de Windows** si te la pide

9. **¡Listo!** El backup se ejecutará automáticamente cada primer día del mes a las 2 AM

---

### ✅ **PASO 5: Verificar Tarea Programada**

1. **En el Programador de tareas:**
   - Busca "Backup Sistema Ventas" en la lista

2. **Click derecho → "Ejecutar"** para probar

3. **Espera 10-15 segundos**

4. **Verifica que se creó el backup:**
   - Abre: `[Tu ruta]\Backups_Licoreria_Cueva\`
   - Deberías ver: `backup_ventas_20260128_XXXXXX.sql`

---

## 4. ARRANQUE AUTOMÁTICO

### 🔄 **Opción 1: Acceso Directo en el Escritorio**

1. **Click derecho en:**
   ```
   INICIAR_SISTEMA.bat
   ```

2. **Selecciona:** "Crear acceso directo"

3. **Arrastra el acceso directo al Escritorio**

4. **Renómbralo a:** "Sistema de Ventas"

5. **¡Listo!** Ahora puedes iniciar con doble clic desde el escritorio

---

### 🚀 **Opción 2: Inicio Automático al Encender la PC**

**⚠️ IMPORTANTE:** Solo configura esto cuando estés seguro de que todo funciona.

1. **Presiona:** `Windows + R`

2. **Escribe:** `shell:startup`

3. **Presiona:** Enter

4. **Se abrirá una carpeta**

5. **Crea un acceso directo:**
   - Click derecho en la carpeta → "Nuevo" → "Acceso directo"
   - Examinar → Busca: `C:\Proyectos\sistema-ventas\INICIAR_SISTEMA.bat`
   - Nombre: "Sistema de Ventas"
   - Finalizar

6. **¡Listo!** Ahora el sistema se iniciará automáticamente al encender la PC

**Resultado:**
```
Encender PC
   ↓
Docker se inicia (30 seg)
   ↓
Sistema se levanta (15 seg)
   ↓
Navegador se abre automáticamente
   ↓
¡Listo para usar! (total: ~45 seg)
```

---

## 5. PRIMER USO

### 👤 **Crear Usuarios Adicionales**

1. **Inicia sesión como admin:**
   ```
   Usuario: admin
   Contraseña: admin123
   ```

2. **Ve a:** "Usuarios" (en el menú lateral)

3. **Click en:** "+ Nuevo Usuario"

4. **Completa el formulario:**
   ```
   Nombre: Juan Pérez
   Usuario: juan
   Contraseña: juan123
   Rol: Vendedor
   ```

5. **Click en:** "Guardar"

---

### 📦 **Agregar Productos**

1. **Ve a:** "Productos"

2. **Click en:** "+ Nuevo Producto"

3. **Completa:**
   ```
   Nombre: Cerveza Cusqueña
   Precio: 4.50
   Stock: 100
   ```

4. **Click en:** "Guardar"

---

### 💰 **Realizar Primera Venta**

1. **Ve a:** "Nueva Venta"

2. **Busca productos:**
   - Por código de barras
   - Por nombre
   - O selecciona de la lista

3. **Ajusta cantidades** con los botones +/-

4. **Click en:** "Procesar Venta"

5. **¡Listo!** La venta se registró

---

## 6. PREGUNTAS FRECUENTES

### ❓ **¿El sistema funcionará en otra PC?**

**✅ SÍ**, siempre que:
1. Instales Docker Desktop
2. Copies la carpeta del proyecto
3. Ejecutes `INICIAR_SISTEMA.bat`

**Los datos se mantienen** porque están en Docker Volumes.

---

### ❓ **¿Necesito Internet para usar el sistema?**

**NO** para uso diario:
- ✅ El sistema funciona 100% offline
- ✅ Las ventas se registran sin Internet
- ✅ Los reportes funcionan sin Internet

**SÍ** para:
- ⚠️ Instalación inicial (descargar imágenes de Docker)
- ⚠️ Sincronizar backups con Google Drive
- ⚠️ Actualizar el sistema

---

### ❓ **¿Qué pasa si no configuro Google Drive?**

**El sistema funciona igual**, pero:
- ❌ Los backups solo estarán en la PC
- ❌ Si formateas, pierdes los backups
- ✅ Puedes copiar manualmente los backups a USB

**Alternativa sin Google Drive:**
```
1. Ejecuta BACKUP_AUTOMATICO.bat manualmente
2. Los backups se guardan en una carpeta local
3. Cópialos a USB cada mes
```

---

### ❓ **¿Cómo migro los datos a otra PC?**

**Opción 1: Con Backup (Recomendado)**

1. **En la PC antigua:**
   ```
   - Ejecuta BACKUP_AUTOMATICO.bat
   - Copia el archivo .sql a USB
   ```

2. **En la PC nueva:**
   ```
   - Instala el sistema (pasos 1-4)
   - Copia el backup a la carpeta de backups
   - Ejecuta RESTAURAR_BACKUP.bat
   - Selecciona el archivo
   ```

**Opción 2: Copiando el Volume**

1. **En la PC antigua:**
   ```
   docker-compose down
   docker run --rm -v sitemasdeventasandre_db_data:/data -v C:\backup:/backup alpine tar czf /backup/db_backup.tar.gz /data
   ```

2. **Copia `db_backup.tar.gz` a USB**

3. **En la PC nueva:**
   ```
   docker volume create sitemasdeventasandre_db_data
   docker run --rm -v sitemasdeventasandre_db_data:/data -v C:\backup:/backup alpine tar xzf /backup/db_backup.tar.gz -C /
   docker-compose up -d
   ```

---

### ❓ **¿Cómo actualizo el sistema?**

1. **Haz backup:**
   ```
   BACKUP_AUTOMATICO.bat
   ```

2. **Descarga la nueva versión de GitHub:**
   ```
   git pull origin main
   ```
   O descarga el ZIP y reemplaza los archivos

3. **Reconstruye los contenedores:**
   ```
   docker-compose down
   docker-compose up --build -d
   ```

4. **Los datos se mantienen** (están en el volume)

---

### ❓ **¿Qué hago si algo falla?**

**Paso 1: Verifica Docker**
```
docker info
```
Si da error → Reinicia Docker Desktop

**Paso 2: Verifica los contenedores**
```
docker-compose ps
```
Todos deben estar "Up"

**Paso 3: Reinicia el sistema**
```
docker-compose restart
```

**Paso 4: Si nada funciona**
```
docker-compose down
docker-compose up -d
```

---

## 📞 SOPORTE

### 📧 Contacto

- **Email:** soporte@licoreria-cueva.com
- **WhatsApp:** +51 999 999 999
- **GitHub:** https://github.com/TU_USUARIO/sistema-ventas/issues

### 📚 Documentación Adicional

- `README.md` - Descripción general
- `GUIA_DE_USO.md` - Cómo usar el sistema
- `GUIA_EMPRESARIAL.md` - Configuración avanzada
- `EXPLICACION_VOLUMES.md` - Persistencia de datos
- `GUIA_ESCALABILIDAD.md` - Crecimiento futuro

---

## ✅ CHECKLIST DE INSTALACIÓN

Marca cada paso cuando lo completes:

### Instalación Básica
- [ ] Docker Desktop instalado
- [ ] Proyecto descargado
- [ ] `INICIAR_SISTEMA.bat` ejecutado
- [ ] Sistema abre en el navegador
- [ ] Login con admin/admin123 funciona

### Backups (Opcional)
- [ ] Google Drive Desktop instalado
- [ ] Carpeta `Backups_Licoreria_Cueva` creada
- [ ] Ruta configurada en scripts
- [ ] `PROBAR_BACKUP.bat` ejecutado exitosamente
- [ ] Tarea programada configurada

### Arranque Automático (Opcional)
- [ ] Acceso directo en el escritorio
- [ ] Acceso directo en Inicio (opcional)

### Primer Uso
- [ ] Usuario adicional creado
- [ ] Productos agregados
- [ ] Primera venta realizada
- [ ] Backup manual realizado

---

## 🎉 ¡INSTALACIÓN COMPLETADA!

**Tu sistema está listo para funcionar durante 10+ años** 🚀

**Próximos pasos:**
1. Agrega tus productos
2. Crea usuarios para tus empleados
3. Empieza a vender
4. Los backups se harán automáticamente

**¡Éxito con tu negocio!** 🎊
