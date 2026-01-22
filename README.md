# Sistema de Ventas e Inventario

Sistema web completo de ventas e inventario desarrollado con React, Node.js, MySQL y Docker.

## 🚀 Características

- ✅ Registro de ventas con múltiples productos
- ✅ Control de inventario automático
- ✅ Gestión de usuarios por roles (Administrador/Vendedor)
- ✅ Modo claro y oscuro
- ✅ Sistema de sesiones (sin JWT)
- ✅ Completamente dockerizado

## 📋 Requisitos

- Docker Desktop instalado
- Docker Compose
- Puerto 3000, 5000 y 3306 disponibles

## 🛠️ Instalación y Ejecución

### 1. Clonar o descargar el proyecto

```bash
cd "d:\Proyectos Visual Studio\Sitemas de ventas(Andre)"
```

### 2. Iniciar el sistema con Docker

```bash
docker-compose up --build
```

Este comando:
- Creará la base de datos MySQL
- Instalará las dependencias del backend
- Instalará las dependencias del frontend
- Iniciará todos los servicios

### 3. Acceder al sistema

Una vez que todos los contenedores estén corriendo:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **MySQL**: localhost:3306

### 4. Credenciales de acceso

**Usuario Administrador:**
- Usuario: `admin`
- Contraseña: `admin123`

## 📁 Estructura del Proyecto

```
Sistema de Ventas/
├── backend/                 # API Node.js + Express
│   ├── config/             # Configuración de BD
│   ├── routes/             # Rutas de la API
│   ├── server.js           # Servidor principal
│   └── package.json
├── frontend/               # Aplicación React + Vite
│   ├── src/
│   │   ├── api/           # Cliente Axios
│   │   ├── components/    # Componentes React
│   │   ├── context/       # Contextos (Auth, Theme)
│   │   ├── pages/         # Páginas principales
│   │   └── App.jsx
│   └── package.json
├── database/              # Scripts SQL
│   └── init.sql          # Inicialización de BD
└── docker-compose.yml    # Orquestación Docker
```

## 👥 Roles del Sistema

### Administrador
- ✅ Gestionar productos (crear, editar, eliminar)
- ✅ Controlar inventario
- ✅ Crear usuarios vendedores
- ✅ Visualizar todas las ventas
- ✅ Ver estadísticas y reportes

### Vendedor
- ✅ Registrar ventas
- ✅ Visualizar sus propias ventas
- ❌ No puede modificar productos
- ❌ No puede eliminar ventas
- ❌ No puede modificar stock directamente

## 🛒 Funcionalidades Principales

### 1. Registro de Ventas
- Selección de múltiples productos
- Carrito de compras interactivo
- Validación de stock en tiempo real
- Generación automática de código de venta
- Descuento automático de inventario

### 2. Gestión de Productos
- CRUD completo de productos
- Control de stock
- Estados activo/inactivo
- Precios personalizables

### 3. Gestión de Usuarios
- Creación de vendedores
- Asignación de roles
- Contraseñas encriptadas con bcrypt

### 4. Reportes y Estadísticas (Admin)
- Total de ventas
- Ventas del día
- Productos más vendidos
- Promedio por venta

## 🗄️ Base de Datos

### Tablas Principales

**usuarios**
- id_usuario
- nombre
- usuario
- password (hasheado)
- rol (administrador/vendedor)
- fecha_creacion

**productos**
- id_producto
- nombre
- precio
- stock
- estado (activo/inactivo)
- fecha_creacion

**ventas**
- id_venta
- codigo_venta (único)
- id_usuario
- fecha
- total

**detalle_venta**
- id_detalle
- id_venta
- id_producto
- cantidad
- precio_unitario
- subtotal

## 🔧 Comandos Útiles

### Detener el sistema
```bash
docker-compose down
```

### Ver logs
```bash
docker-compose logs -f
```

### Reiniciar servicios
```bash
docker-compose restart
```

### Limpiar y reiniciar desde cero
```bash
docker-compose down -v
docker-compose up --build
```

### Acceder a la base de datos
```bash
docker exec -it ventas_db mysql -u ventas_user -pventas_pass sistema_ventas
```

## 🎨 Temas

El sistema incluye modo claro y oscuro que se puede cambiar desde:
- Página de login
- Sidebar del sistema (una vez autenticado)

La preferencia se guarda en localStorage.

## 🔒 Seguridad

- Contraseñas hasheadas con bcrypt (10 rounds)
- Sesiones HTTP-only
- Validación de roles en backend
- Protección contra inyección SQL (prepared statements)
- CORS configurado

## 📱 Responsive

El sistema es completamente responsive y funciona en:
- Desktop
- Tablets
- Móviles

## 🐛 Solución de Problemas

### El frontend no se conecta al backend
- Verificar que todos los contenedores estén corriendo: `docker-compose ps`
- Verificar los logs: `docker-compose logs backend`

### Error de conexión a MySQL
- Esperar a que MySQL termine de inicializar (puede tomar 30-60 segundos)
- Verificar: `docker-compose logs db`

### Puertos ocupados
- Cambiar los puertos en `docker-compose.yml`
- Ejemplo: `"3001:3000"` para usar el puerto 3001

## 📝 Notas Importantes

1. **No se usa JWT**: El sistema usa sesiones tradicionales de Express
2. **No hay módulo de clientes**: Las ventas no requieren registro de clientes
3. **Stock automático**: El stock se descuenta automáticamente al registrar una venta
4. **Transacciones**: Las ventas usan transacciones MySQL para garantizar integridad

## 🚀 Producción

Para producción, modificar:

1. Variables de entorno en `docker-compose.yml`
2. Cambiar `SESSION_SECRET` por uno seguro
3. Configurar `cookie.secure: true` en `server.js`
4. Usar HTTPS
5. Cambiar contraseñas de MySQL

## 📄 Licencia

Este proyecto es de código abierto para uso educativo y comercial.

## 👨‍💻 Soporte

Para problemas o preguntas, revisar:
1. Los logs de Docker
2. La consola del navegador
3. Los logs del backend

---

**Desarrollado con ❤️ usando React, Node.js, MySQL y Docker**
