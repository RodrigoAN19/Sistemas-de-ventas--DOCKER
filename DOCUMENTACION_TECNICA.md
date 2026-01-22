# DOCUMENTACIÓN TÉCNICA - Sistema de Ventas e Inventario

## 📋 Tabla de Contenidos
1. [Arquitectura del Sistema](#arquitectura)
2. [Stack Tecnológico](#stack)
3. [Base de Datos](#base-de-datos)
4. [API Backend](#api-backend)
5. [Frontend](#frontend)
6. [Seguridad](#seguridad)
7. [Despliegue](#despliegue)

---

## 🏗️ Arquitectura del Sistema {#arquitectura}

### Arquitectura de 3 Capas

```
┌─────────────────────────────────────────┐
│         FRONTEND (React + Vite)         │
│         Puerto: 3000                    │
│  - Interfaz de usuario                  │
│  - Gestión de estado (Context API)      │
│  - Routing (React Router)               │
└─────────────────┬───────────────────────┘
                  │ HTTP/Axios
                  │ Sesiones
┌─────────────────▼───────────────────────┐
│       BACKEND (Node.js + Express)       │
│         Puerto: 5000                    │
│  - API RESTful                          │
│  - Autenticación con sesiones           │
│  - Lógica de negocio                    │
│  - Validaciones                         │
└─────────────────┬───────────────────────┘
                  │ MySQL2
                  │ Connection Pool
┌─────────────────▼───────────────────────┐
│         BASE DE DATOS (MySQL 8.0)       │
│         Puerto: 3306                    │
│  - Almacenamiento persistente           │
│  - Transacciones ACID                   │
│  - Procedimientos almacenados           │
└─────────────────────────────────────────┘
```

### Contenedores Docker

- **ventas_frontend**: Aplicación React
- **ventas_backend**: API Node.js
- **ventas_db**: Base de datos MySQL
- **Red**: ventas_network (bridge)
- **Volumen**: db_data (persistencia MySQL)

---

## 🛠️ Stack Tecnológico {#stack}

### Frontend
- **React 18.2**: Librería de UI
- **Vite 5.0**: Build tool y dev server
- **React Router DOM 6.20**: Enrutamiento SPA
- **Axios 1.6**: Cliente HTTP
- **CSS Vanilla**: Estilos personalizados

### Backend
- **Node.js 18**: Runtime JavaScript
- **Express 4.18**: Framework web
- **MySQL2 3.6**: Driver MySQL con promesas
- **bcrypt 5.1**: Hash de contraseñas
- **express-session 1.17**: Manejo de sesiones
- **cors 2.8**: Cross-Origin Resource Sharing
- **dotenv 16.3**: Variables de entorno

### Base de Datos
- **MySQL 8.0**: Sistema de gestión de BD relacional
- **InnoDB**: Motor de almacenamiento

### Infraestructura
- **Docker**: Containerización
- **Docker Compose**: Orquestación de contenedores

---

## 🗄️ Base de Datos {#base-de-datos}

### Diagrama Entidad-Relación

```
┌─────────────────┐
│    USUARIOS     │
├─────────────────┤
│ id_usuario (PK) │
│ nombre          │
│ usuario (UNIQUE)│
│ password        │
│ rol             │
│ fecha_creacion  │
└────────┬────────┘
         │
         │ 1:N
         │
┌────────▼────────┐       ┌──────────────────┐
│     VENTAS      │       │    PRODUCTOS     │
├─────────────────┤       ├──────────────────┤
│ id_venta (PK)   │       │ id_producto (PK) │
│ codigo_venta    │       │ nombre           │
│ id_usuario (FK) │       │ precio           │
│ fecha           │       │ stock            │
│ total           │       │ estado           │
└────────┬────────┘       │ fecha_creacion   │
         │                └────────┬─────────┘
         │ 1:N                     │
         │                         │ N:1
┌────────▼─────────────────────────▼─┐
│        DETALLE_VENTA               │
├────────────────────────────────────┤
│ id_detalle (PK)                    │
│ id_venta (FK)                      │
│ id_producto (FK)                   │
│ cantidad                           │
│ precio_unitario                    │
│ subtotal                           │
└────────────────────────────────────┘
```

### Índices

```sql
-- Usuarios
INDEX idx_usuario (usuario)
INDEX idx_rol (rol)

-- Productos
INDEX idx_nombre (nombre)
INDEX idx_estado (estado)

-- Ventas
INDEX idx_codigo (codigo_venta)
INDEX idx_fecha (fecha)
INDEX idx_usuario (id_usuario)

-- Detalle Venta
INDEX idx_venta (id_venta)
INDEX idx_producto (id_producto)
```

### Vistas

**vista_ventas**: Ventas con información del vendedor
```sql
SELECT v.*, u.nombre as vendedor 
FROM ventas v 
INNER JOIN usuarios u ON v.id_usuario = u.id_usuario
```

**vista_detalle_ventas**: Detalle con nombres de productos
```sql
SELECT dv.*, v.codigo_venta, p.nombre as producto
FROM detalle_venta dv
INNER JOIN ventas v ON dv.id_venta = v.id_venta
INNER JOIN productos p ON dv.id_producto = p.id_producto
```

### Procedimientos Almacenados

**registrar_venta**: Inserta venta con manejo de transacciones
```sql
CALL registrar_venta(codigo, id_usuario, total, @id_venta)
```

---

## 🔌 API Backend {#api-backend}

### Endpoints

#### Autenticación (`/api/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Iniciar sesión | No |
| POST | `/logout` | Cerrar sesión | Sí |
| GET | `/session` | Verificar sesión | No |

**Ejemplo Login:**
```json
POST /api/auth/login
{
  "usuario": "admin",
  "password": "admin123"
}

Response:
{
  "message": "Login exitoso",
  "user": {
    "id": 1,
    "nombre": "Administrador",
    "usuario": "admin",
    "rol": "administrador"
  }
}
```

#### Productos (`/api/productos`)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar activos | Todos |
| GET | `/todos` | Listar todos | Admin |
| POST | `/` | Crear producto | Admin |
| PUT | `/:id` | Actualizar | Admin |
| DELETE | `/:id` | Desactivar | Admin |

**Ejemplo Crear Producto:**
```json
POST /api/productos
{
  "nombre": "Coca Cola 500ml",
  "precio": 2.50,
  "stock": 100
}

Response:
{
  "message": "Producto creado exitosamente",
  "id": 1
}
```

#### Ventas (`/api/ventas`)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar ventas | Todos* |
| GET | `/:id` | Ver detalle | Todos* |
| POST | `/` | Registrar venta | Todos |
| GET | `/estadisticas/resumen` | Estadísticas | Admin |

*Vendedores solo ven sus propias ventas

**Ejemplo Registrar Venta:**
```json
POST /api/ventas
{
  "productos": [
    {
      "id_producto": 1,
      "cantidad": 5,
      "precio_unitario": 3.50
    },
    {
      "id_producto": 2,
      "cantidad": 2,
      "precio_unitario": 2.50
    }
  ]
}

Response:
{
  "message": "Venta registrada exitosamente",
  "venta": {
    "id": 1,
    "codigo": "V20260120193000123",
    "total": 22.50
  }
}
```

#### Usuarios (`/api/usuarios`)

| Método | Endpoint | Descripción | Rol |
|--------|----------|-------------|-----|
| GET | `/` | Listar usuarios | Admin |
| POST | `/` | Crear usuario | Admin |
| PUT | `/:id` | Actualizar | Admin |
| DELETE | `/:id` | Eliminar | Admin |

### Middlewares

**isAuthenticated**: Verifica sesión activa
```javascript
if (req.session && req.session.userId) {
    return next();
}
return res.status(401).json({ error: 'No autenticado' });
```

**isAdmin**: Verifica rol de administrador
```javascript
if (req.session && req.session.rol === 'administrador') {
    return next();
}
return res.status(403).json({ error: 'Acceso denegado' });
```

### Manejo de Errores

- **401 Unauthorized**: No autenticado
- **403 Forbidden**: Sin permisos
- **404 Not Found**: Recurso no encontrado
- **400 Bad Request**: Datos inválidos
- **500 Internal Server Error**: Error del servidor

---

## 🎨 Frontend {#frontend}

### Estructura de Componentes

```
src/
├── api/
│   └── axios.js              # Cliente HTTP configurado
├── context/
│   ├── AuthContext.jsx       # Autenticación global
│   └── ThemeContext.jsx      # Tema claro/oscuro
├── components/
│   ├── Layout.jsx            # Layout principal
│   ├── Layout.css
│   └── PrivateRoute.jsx      # Rutas protegidas
├── pages/
│   ├── Login.jsx             # Página de login
│   ├── Login.css
│   ├── Dashboard.jsx         # Dashboard
│   ├── Productos.jsx         # Gestión productos
│   ├── Ventas.jsx            # Historial ventas
│   ├── NuevaVenta.jsx        # Registrar venta
│   ├── NuevaVenta.css
│   └── Usuarios.jsx          # Gestión usuarios
├── App.jsx                   # Componente raíz
├── main.jsx                  # Entry point
└── index.css                 # Estilos globales
```

### Context API

**AuthContext**: Manejo de autenticación
```javascript
const { user, login, logout, isAdmin, isVendedor } = useAuth();
```

**ThemeContext**: Manejo de tema
```javascript
const { theme, toggleTheme, isDark } = useTheme();
```

### Rutas

```javascript
/login                  # Pública
/                       # Redirect a /dashboard
/dashboard              # Privada
/productos              # Privada (Admin)
/ventas                 # Privada
/ventas/nueva           # Privada
/usuarios               # Privada (Admin)
```

### Sistema de Temas

Variables CSS dinámicas:
```css
:root {
  --bg-primary: #f8f9fa;
  --text-primary: #212529;
  --primary: #4f46e5;
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --text-primary: #f8f9fa;
}
```

---

## 🔒 Seguridad {#seguridad}

### Autenticación

**Sesiones HTTP**
- No se usa JWT
- Sesiones almacenadas en memoria
- Cookie httpOnly
- Timeout: 8 horas

**Contraseñas**
- Hash con bcrypt
- Salt rounds: 10
- Nunca se almacenan en texto plano

### Autorización

**Niveles de acceso:**
1. **Público**: Login
2. **Autenticado**: Dashboard, Ventas
3. **Admin**: Productos, Usuarios, Estadísticas

**Validación en Backend**
- Middleware isAuthenticated
- Middleware isAdmin
- Validación en cada endpoint

### Protección contra Ataques

**SQL Injection**
- Prepared statements (mysql2)
- Parámetros escapados

**XSS (Cross-Site Scripting)**
- React escapa automáticamente
- No uso de dangerouslySetInnerHTML

**CSRF**
- SameSite cookies
- CORS configurado

**CORS**
```javascript
cors({
    origin: 'http://localhost:3000',
    credentials: true
})
```

---

## 🚀 Despliegue {#despliegue}

### Variables de Entorno

**Backend (.env)**
```env
DB_HOST=db
DB_USER=ventas_user
DB_PASSWORD=ventas_pass
DB_NAME=sistema_ventas
DB_PORT=3306
PORT=5000
SESSION_SECRET=ventas_secret_key_2024
```

**Frontend (.env)**
```env
VITE_API_URL=http://localhost:5000
```

### Docker Compose

**Servicios:**
1. **db**: MySQL 8.0
2. **backend**: Node.js 18
3. **frontend**: Node.js 18 + Vite

**Volúmenes:**
- `db_data`: Persistencia MySQL
- `./backend:/app`: Hot reload backend
- `./frontend:/app`: Hot reload frontend

**Healthcheck MySQL:**
```yaml
healthcheck:
  test: ["CMD", "mysqladmin", "ping", "-h", "localhost"]
  timeout: 20s
  retries: 10
```

### Comandos Docker

```bash
# Iniciar
docker-compose up --build

# Detener
docker-compose down

# Ver logs
docker-compose logs -f [servicio]

# Reiniciar
docker-compose restart [servicio]

# Limpiar todo
docker-compose down -v
```

### Producción

**Checklist:**
1. ✅ Cambiar SESSION_SECRET
2. ✅ Usar contraseñas seguras MySQL
3. ✅ Configurar HTTPS
4. ✅ cookie.secure = true
5. ✅ Configurar CORS específico
6. ✅ Usar variables de entorno
7. ✅ Build de producción frontend
8. ✅ Configurar reverse proxy (nginx)
9. ✅ Backups automáticos BD
10. ✅ Logs persistentes

**Build Producción Frontend:**
```bash
npm run build
# Servir carpeta dist/
```

---

## 📊 Flujo de Datos

### Registro de Venta

```
1. Usuario selecciona productos
   ↓
2. Frontend valida stock
   ↓
3. POST /api/ventas con array de productos
   ↓
4. Backend inicia transacción MySQL
   ↓
5. Verifica stock de cada producto
   ↓
6. Inserta en tabla ventas
   ↓
7. Inserta en detalle_venta
   ↓
8. Actualiza stock (decrementa)
   ↓
9. Commit transacción
   ↓
10. Retorna código de venta
```

### Login

```
1. Usuario ingresa credenciales
   ↓
2. POST /api/auth/login
   ↓
3. Backend busca usuario
   ↓
4. bcrypt.compare(password, hash)
   ↓
5. Crea sesión en req.session
   ↓
6. Retorna datos de usuario
   ↓
7. Frontend guarda en AuthContext
   ↓
8. Redirect a /dashboard
```

---

## 🧪 Testing

### Pruebas Manuales

**Casos de Prueba:**
1. Login con credenciales válidas/inválidas
2. Crear producto con datos válidos/inválidos
3. Venta con stock suficiente/insuficiente
4. Venta múltiple productos
5. Verificar descuento de stock
6. Cambio de tema
7. Cierre de sesión
8. Acceso no autorizado

### Herramientas Recomendadas

- **Postman**: Pruebas de API
- **MySQL Workbench**: Gestión BD
- **Docker Desktop**: Monitoreo contenedores
- **Chrome DevTools**: Debug frontend

---

## 📈 Optimizaciones

### Base de Datos
- Índices en campos de búsqueda
- Connection pool (10 conexiones)
- Prepared statements
- Transacciones para integridad

### Backend
- Async/await para operaciones BD
- Manejo de errores centralizado
- Validaciones tempranas

### Frontend
- Code splitting (React.lazy)
- Memoización (useMemo, useCallback)
- Optimistic UI updates
- Debounce en búsquedas

---

## 🔧 Mantenimiento

### Backups

**Base de Datos:**
```bash
docker exec ventas_db mysqldump -u ventas_user -pventas_pass sistema_ventas > backup.sql
```

**Restaurar:**
```bash
docker exec -i ventas_db mysql -u ventas_user -pventas_pass sistema_ventas < backup.sql
```

### Logs

**Ver logs en tiempo real:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f db
```

### Actualización de Dependencias

```bash
# Backend
cd backend
npm update

# Frontend
cd frontend
npm update
```

---

## 📚 Referencias

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [MySQL 8.0 Reference](https://dev.mysql.com/doc/refman/8.0/en/)
- [Docker Documentation](https://docs.docker.com)
- [bcrypt npm](https://www.npmjs.com/package/bcrypt)

---

**Versión del Sistema: 1.0.0**  
**Última Actualización: Enero 2026**
