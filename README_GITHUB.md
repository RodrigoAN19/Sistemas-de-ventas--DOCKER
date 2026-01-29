# 🏪 Sistema de Ventas e Inventarios - Licorería

[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-orange)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20-green)](https://nodejs.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

Sistema POS (Point of Sale) completo para gestión de ventas e inventarios, diseñado para funcionar de manera estable durante más de 10 años sin pérdida de datos.

![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Preview)

---

## ✨ Características Principales

### 🎯 Punto de Venta (POS)
- ✅ Registro rápido de ventas con interfaz intuitiva
- ✅ 3 métodos de búsqueda: código de barras, texto, lista
- ✅ Selector visual de cantidades
- ✅ Impresión de tickets
- ✅ Historial completo de ventas

### 📦 Gestión de Inventario
- ✅ CRUD completo de productos
- ✅ Control de stock en tiempo real
- ✅ Alertas de stock bajo
- ✅ Búsqueda y filtros avanzados

### 📊 Dashboard Analítico
- ✅ Estadísticas en tiempo real
- ✅ Vistas: General, Mensual, Diaria
- ✅ Top 5 productos más vendidos
- ✅ Gráficos interactivos

### 📄 Reportes
- ✅ Exportación a PDF
- ✅ Exportación a Excel
- ✅ Filtros por fecha
- ✅ Resúmenes personalizados

### 👥 Gestión de Usuarios
- ✅ Roles: Administrador y Vendedor
- ✅ Permisos diferenciados
- ✅ Sesiones seguras
- ✅ Historial por usuario

### 🔒 Características Empresariales
- ✅ Persistencia de datos garantizada (Docker Volumes)
- ✅ Backups automáticos mensuales
- ✅ Sincronización con Google Drive
- ✅ Funcionamiento 100% offline
- ✅ Arranque automático
- ✅ Escalable a múltiples sucursales

---

## 🚀 Instalación Rápida

### Requisitos Previos

- **Windows 10/11** (64 bits)
- **Docker Desktop** instalado
- **8 GB RAM** mínimo
- **20 GB** espacio en disco

### Instalación en 3 Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/TU_USUARIO/sistema-ventas.git
cd sistema-ventas

# 2. Iniciar el sistema
# En Windows: Doble clic en INICIAR_SISTEMA.bat
# O ejecutar:
docker-compose up -d

# 3. Abrir en el navegador
# http://localhost:3000
```

**Credenciales por defecto:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 📖 Documentación Completa

- 📘 **[INSTALACION_COMPLETA.md](./INSTALACION_COMPLETA.md)** - Guía paso a paso para usuario final
- 📗 **[GUIA_DE_USO.md](./GUIA_DE_USO.md)** - Cómo usar el sistema
- 📙 **[GUIA_EMPRESARIAL.md](./GUIA_EMPRESARIAL.md)** - Configuración avanzada
- 📕 **[DOCUMENTACION_TECNICA.md](./DOCUMENTACION_TECNICA.md)** - Para desarrolladores
- 📔 **[EXPLICACION_VOLUMES.md](./EXPLICACION_VOLUMES.md)** - Persistencia de datos
- 📓 **[GUIA_ESCALABILIDAD.md](./GUIA_ESCALABILIDAD.md)** - Crecimiento futuro

---

## 🏗️ Arquitectura

### Stack Tecnológico

```
Frontend:  React 18 + Vite + Axios
Backend:   Node.js 20 + Express + MySQL2
Database:  MySQL 8.0
Container: Docker + Docker Compose
```

### Estructura del Proyecto

```
sistema-ventas/
├── frontend/              # Aplicación React
│   ├── src/
│   │   ├── components/   # Componentes reutilizables
│   │   ├── pages/        # Páginas principales
│   │   ├── context/      # Context API
│   │   └── api/          # Configuración de Axios
│   └── Dockerfile
│
├── backend/               # API Node.js
│   ├── routes/           # Rutas de la API
│   ├── config/           # Configuración
│   └── Dockerfile
│
├── database/              # Scripts de base de datos
│   └── init.sql          # Estructura inicial
│
├── docker-compose.yml     # Orquestación de contenedores
│
├── INICIAR_SISTEMA.bat    # Script de inicio automático
├── BACKUP_AUTOMATICO.bat  # Script de backup
└── RESTAURAR_BACKUP.bat   # Script de restauración
```

---

## 🔧 Configuración

### Variables de Entorno

El sistema usa las siguientes variables de entorno (ya configuradas en `docker-compose.yml`):

```env
# Backend
DB_HOST=db
DB_USER=ventas_user
DB_PASSWORD=ventas_pass
DB_NAME=sistema_ventas
DB_PORT=3306
PORT=5000
SESSION_SECRET=ventas_secret_key_2024

# Frontend
VITE_API_URL=http://localhost:5000
```

### Puertos

```
Frontend: 3000
Backend:  5000
MySQL:    3306
```

---

## 💾 Backups Automáticos

### Configuración

1. **Instala Google Drive Desktop** (opcional pero recomendado)
2. **Crea la carpeta:** `Backups_Licoreria_Cueva` en Google Drive
3. **Configura la tarea programada** (ver [INSTALACION_COMPLETA.md](./INSTALACION_COMPLETA.md))

### Uso Manual

```bash
# Crear backup
./BACKUP_AUTOMATICO.bat

# Restaurar backup
./RESTAURAR_BACKUP.bat
```

### Ubicación de Backups

```
G:\Mi unidad\Backups_Licoreria_Cueva\
├── backup_ventas_20260128_202010.sql
├── backup_ventas_20260201_020000.sql (automático)
├── backup_log.txt
└── error_log.txt
```

---

## 🔒 Seguridad

### Persistencia de Datos

Los datos se almacenan en **Docker Volumes**, garantizando:

- ✅ Persistencia ante reinicios del sistema
- ✅ Persistencia ante actualizaciones
- ✅ Independencia de los contenedores
- ✅ Backups automáticos mensuales

### Autenticación

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sesiones seguras con express-session
- ✅ Roles y permisos diferenciados
- ✅ Protección CSRF

---

## 📈 Escalabilidad

El sistema está diseñado para crecer:

### Fase 1: Local (Actual)
- 1 PC, 1 usuario
- Sin costo mensual
- 100% offline

### Fase 2: Servidor Local
- Múltiples PCs en red local
- 5-10 usuarios simultáneos
- ~$5/mes (electricidad)

### Fase 3: Múltiples Sucursales
- Sincronización entre sucursales
- 10-50 usuarios
- ~$10-15/mes (VPS)

### Fase 4: Cloud Completo
- Alta disponibilidad
- 50+ usuarios
- ~$30-100/mes (AWS/GCP)

**Ver:** [GUIA_ESCALABILIDAD.md](./GUIA_ESCALABILIDAD.md)

---

## 🛠️ Desarrollo

### Requisitos para Desarrolladores

```bash
Node.js 20+
Docker Desktop
Git
```

### Instalación para Desarrollo

```bash
# Clonar repositorio
git clone https://github.com/TU_USUARIO/sistema-ventas.git
cd sistema-ventas

# Instalar dependencias del backend
cd backend
npm install

# Instalar dependencias del frontend
cd ../frontend
npm install

# Volver a la raíz
cd ..

# Iniciar con Docker
docker-compose up -d
```

### Scripts de Desarrollo

```bash
# Backend
cd backend
npm run dev      # Modo desarrollo con nodemon

# Frontend
cd frontend
npm run dev      # Vite dev server
npm run build    # Build para producción
npm run preview  # Preview del build
```

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📊 Roadmap

### Versión 2.1 (Q2 2026)
- [ ] Gestión de clientes
- [ ] Programa de fidelidad
- [ ] Reportes avanzados
- [ ] Gráficos interactivos mejorados

### Versión 2.2 (Q3 2026)
- [ ] App móvil (React Native)
- [ ] Notificaciones push
- [ ] Integración con WhatsApp

### Versión 3.0 (Q4 2026)
- [ ] Múltiples sucursales
- [ ] Sincronización en tiempo real
- [ ] API pública
- [ ] Marketplace de plugins

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

## 👥 Autores

- **Rodrigo AN** - *Desarrollo Inicial* - [@RodrigoAN19](https://github.com/RodrigoAN19)

---

## 🙏 Agradecimientos

- Docker por la tecnología de contenedores
- MySQL por la base de datos confiable
- React por el framework frontend
- Node.js por el runtime backend
- Google Drive por el almacenamiento en la nube

---

## 📞 Soporte

¿Necesitas ayuda?

- 📧 **Email:** soporte@licoreria-cueva.com
- 💬 **GitHub Issues:** [Crear Issue](https://github.com/TU_USUARIO/sistema-ventas/issues)
- 📚 **Documentación:** Ver carpeta `docs/`
- 💡 **FAQ:** [INSTALACION_COMPLETA.md](./INSTALACION_COMPLETA.md#preguntas-frecuentes)

---

## ⭐ Star History

Si este proyecto te fue útil, ¡dale una estrella! ⭐

---

**Hecho con ❤️ para pequeños negocios que quieren crecer**

**Sistema garantizado para funcionar 10+ años sin pérdida de datos** 🚀
