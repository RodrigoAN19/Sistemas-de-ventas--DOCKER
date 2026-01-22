# GUÍA DE USO - Sistema de Ventas e Inventario

## 🎯 Inicio Rápido

### 1. Iniciar el Sistema

```bash
# Navegar a la carpeta del proyecto
cd "d:\Proyectos Visual Studio\Sitemas de ventas(Andre)"

# Iniciar con Docker
docker-compose up --build
```

Espera a que aparezcan estos mensajes:
- ✅ MySQL: "ready for connections"
- ✅ Backend: "Servidor corriendo en puerto 5000"
- ✅ Frontend: "Local: http://localhost:3000"

### 2. Acceder al Sistema

Abre tu navegador en: **http://localhost:3000**

**Credenciales de prueba:**
- Usuario: `admin`
- Contraseña: `admin123`

## 📚 Guía de Uso por Rol

### 👨‍💼 ADMINISTRADOR

#### Dashboard
Al iniciar sesión verás:
- Total de ventas realizadas
- Ventas del día
- Promedio por venta
- Productos más vendidos

#### Gestión de Productos

1. **Crear Producto**
   - Click en "📦 Productos" en el menú
   - Click en "➕ Nuevo Producto"
   - Llenar formulario:
     - Nombre del producto
     - Precio (ejemplo: 3.50)
     - Stock inicial
   - Click en "💾 Guardar"

2. **Editar Producto**
   - Click en "✏️ Editar" en la fila del producto
   - Modificar los campos necesarios
   - Cambiar estado si es necesario
   - Click en "💾 Guardar"

3. **Desactivar Producto**
   - Click en "🗑️ Desactivar"
   - Confirmar acción
   - El producto ya no aparecerá en ventas

#### Gestión de Usuarios

1. **Crear Vendedor**
   - Click en "👥 Usuarios"
   - Click en "➕ Nuevo Usuario"
   - Llenar datos:
     - Nombre completo
     - Usuario (para login)
     - Contraseña
     - Rol: Vendedor o Administrador
   - Click en "💾 Guardar"

2. **Editar Usuario**
   - Click en "✏️ Editar"
   - Modificar datos
   - Dejar contraseña vacía si no quieres cambiarla
   - Click en "💾 Guardar"

3. **Eliminar Usuario**
   - Click en "🗑️ Eliminar"
   - Confirmar acción
   - No puedes eliminar tu propio usuario

#### Ver Todas las Ventas
- Click en "📋 Ventas"
- Verás TODAS las ventas del sistema
- Click en "👁️ Ver Detalle" para ver productos vendidos

### 👨‍💻 VENDEDOR

#### Registrar una Venta

1. **Ir a Nueva Venta**
   - Click en "➕ Nueva Venta" en el menú

2. **Agregar Productos**
   - Seleccionar producto del dropdown
   - Ingresar cantidad
   - Click en "➕ Agregar al Carrito"
   - Repetir para agregar más productos

3. **Modificar Carrito**
   - Usar botones **+** y **-** para cambiar cantidad
   - Click en **🗑️** para eliminar producto del carrito

4. **Finalizar Venta**
   - Verificar el total
   - Click en "💰 Registrar Venta"
   - Esperar confirmación
   - Serás redirigido al historial

#### Ver Mis Ventas
- Click en "📋 Ventas"
- Verás solo TUS ventas
- Click en "👁️ Ver Detalle" para ver productos

## 🎨 Cambiar Tema (Modo Oscuro/Claro)

### Desde Login
- Click en el botón "🌙 Modo Oscuro" o "☀️ Modo Claro"

### Desde el Sistema
- En el menú lateral (sidebar)
- Click en el botón de tema
- El cambio es inmediato y se guarda

## 💡 Casos de Uso Comunes

### Caso 1: Venta Simple (1 producto)
```
1. Nueva Venta
2. Seleccionar "Cerveza Pilsen"
3. Cantidad: 5
4. Agregar al Carrito
5. Registrar Venta
```

### Caso 2: Venta Múltiple (varios productos)
```
1. Nueva Venta
2. Agregar: 5 Cervezas
3. Agregar: 2 Gaseosas
4. Agregar: 1 Galleta
5. Agregar: 3 Snacks
6. Verificar total en el carrito
7. Registrar Venta
```

### Caso 3: Modificar Stock de Producto
```
1. Ir a Productos
2. Buscar el producto
3. Click en Editar
4. Cambiar el stock
5. Guardar
```

### Caso 4: Crear Nuevo Vendedor
```
1. Ir a Usuarios
2. Nuevo Usuario
3. Nombre: "Juan Pérez"
4. Usuario: "jperez"
5. Contraseña: "vendedor123"
6. Rol: Vendedor
7. Guardar
```

## ⚠️ Validaciones del Sistema

### Al Registrar Venta
- ❌ No puedes vender sin productos en el carrito
- ❌ No puedes vender más de lo que hay en stock
- ❌ La cantidad debe ser mayor a 0
- ✅ El stock se descuenta automáticamente

### Al Crear Producto
- ❌ El nombre es obligatorio
- ❌ El precio debe ser mayor a 0
- ❌ El stock no puede ser negativo

### Al Crear Usuario
- ❌ El usuario no puede estar duplicado
- ❌ Todos los campos son obligatorios
- ❌ El rol debe ser válido

## 🔍 Ver Detalle de Venta

1. Ir a "📋 Ventas"
2. Click en "👁️ Ver Detalle" de cualquier venta
3. Se mostrará:
   - Código de venta único
   - Fecha y hora
   - Total de la venta
   - Lista de productos vendidos
   - Cantidad de cada producto
   - Precio unitario
   - Subtotal por producto

## 📊 Entender el Dashboard (Admin)

### Total Ventas
- Cantidad total de ventas registradas
- Monto total vendido (en soles)

### Ventas Hoy
- Ventas realizadas el día actual
- Monto del día

### Promedio
- Promedio de venta (Total ÷ Cantidad de ventas)

### Productos Más Vendidos
- Top 5 productos con más unidades vendidas
- Útil para saber qué reabastecer

## 🚪 Cerrar Sesión

1. Click en "🚪 Cerrar Sesión" en el menú lateral
2. Serás redirigido al login
3. Tu sesión se destruye completamente

## 🔄 Flujo Completo de Trabajo

### Día 1 - Configuración (Admin)
```
1. Login como admin
2. Crear productos del inventario
3. Crear usuarios vendedores
4. Verificar stock inicial
```

### Día a Día - Vendedor
```
1. Login
2. Registrar ventas según clientes
3. Ver historial de ventas propias
4. Cerrar sesión al terminar
```

### Día a Día - Admin
```
1. Login
2. Ver dashboard y estadísticas
3. Revisar todas las ventas
4. Reabastecer productos con poco stock
5. Crear nuevos productos si es necesario
6. Gestionar usuarios
```

## 📱 Uso en Móvil

El sistema es responsive:
- El menú se adapta a pantalla pequeña
- Las tablas son scrolleables
- Los botones son táctiles
- Funciona igual que en desktop

## ⚡ Atajos y Tips

### Tips para Vendedores
- Usa Tab para navegar entre campos
- Enter para agregar producto al carrito
- Verifica el stock antes de prometer al cliente
- El código de venta se genera automáticamente

### Tips para Administradores
- Revisa el dashboard diariamente
- Mantén stock de productos más vendidos
- Crea contraseñas seguras para vendedores
- Desactiva productos en vez de eliminarlos

## 🆘 Problemas Comunes

### "Stock insuficiente"
- El producto no tiene suficiente stock
- Verificar stock disponible
- Admin debe reabastecer

### "Credenciales inválidas"
- Usuario o contraseña incorrectos
- Verificar mayúsculas/minúsculas
- Contactar al administrador

### "Acceso denegado"
- Intentas acceder a función de admin siendo vendedor
- Solo admin puede gestionar productos y usuarios

### No aparecen productos en Nueva Venta
- No hay productos activos
- Admin debe crear/activar productos

## 📞 Soporte

Si tienes problemas:
1. Verifica que Docker esté corriendo
2. Revisa los logs: `docker-compose logs`
3. Reinicia el sistema: `docker-compose restart`
4. Contacta al administrador del sistema

---

**¡Listo para usar! 🎉**
