# 📋 PLAN DE MEJORAS - Licorería Cueva
## Sistema POS Completo

---

## 🎯 OBJETIVO
Actualizar el sistema existente para cumplir 100% con el **PROMPT DEFINITIVO** del cliente.

---

## ✅ YA IMPLEMENTADO (Base Actual)

- ✅ Docker + Docker Compose
- ✅ React + Vite
- ✅ Node.js + Express
- ✅ MySQL
- ✅ Autenticación por sesión (sin JWT)
- ✅ Roles: Administrador y Vendedor
- ✅ CRUD Productos
- ✅ CRUD Usuarios
- ✅ Sistema de ventas con múltiples productos
- ✅ Carrito de compras
- ✅ Control de inventario automático
- ✅ Modo claro/oscuro
- ✅ Responsive design

---

## ❌ FUNCIONALIDADES FALTANTES

### 🔴 PRIORIDAD ALTA (Críticas)

#### 1. **Campo `codigo_barra` en productos**
- [ ] Agregar columna `codigo_barra` a tabla `productos`
- [ ] Migración de base de datos
- [ ] Actualizar formularios de productos
- [ ] Validación de código único

#### 2. **Lector de Códigos de Barras (3nStar SC050 USB)**
- [ ] Input especial para código de barras
- [ ] Búsqueda automática al escanear
- [ ] Agregar producto automáticamente al carrito
- [ ] Feedback visual al escanear

#### 3. **Impresora Térmica (3nStar RPT008)**
- [ ] Instalación de librería ESC/POS
- [ ] Endpoint backend para imprimir
- [ ] Formato de ticket según especificación
- [ ] Impresión automática al finalizar venta
- [ ] Botón "Reimprimir" en historial

#### 4. **Filtro por Fecha en Ventas**
- [ ] Componente calendario
- [ ] Filtrar ventas por día seleccionado
- [ ] Mostrar resumen diario:
  - Total vendido
  - Número de ventas
  - Promedio por venta

#### 5. **Editar y Eliminar Ventas (Solo Admin)**
- [ ] Endpoint PUT `/api/ventas/:id` (admin)
- [ ] Endpoint DELETE `/api/ventas/:id` (admin)
- [ ] Modal de edición de venta
- [ ] Confirmación antes de eliminar
- [ ] Restaurar stock al eliminar

#### 6. **Exportación de Datos**
- [ ] **PDF**:
  - Dashboard
  - Lista de ventas
  - Lista de productos
- [ ] **Excel**:
  - Ventas
  - Productos
- [ ] Incluir logo "Licorería Cueva"
- [ ] Fecha de generación
- [ ] Totales y resúmenes

#### 7. **Búsqueda Mejorada de Productos**
- [ ] Autocompletado en tiempo real
- [ ] Búsqueda por nombre
- [ ] Búsqueda por código de barras
- [ ] Dropdown con resultados

#### 8. **Botones +/- para Cantidad**
- [ ] Botones incrementar/decrementar
- [ ] Input manual también disponible
- [ ] Validación de stock en tiempo real

#### 9. **Branding "Licorería Cueva"**
- [ ] Actualizar nombre en toda la interfaz
- [ ] Logo en login
- [ ] Logo en sidebar
- [ ] Logo en tickets
- [ ] Favicon personalizado

---

### 🟡 PRIORIDAD MEDIA (Importantes)

#### 10. **Mejoras en Dashboard**
- [ ] Gráfico de ventas por día
- [ ] Top 5 productos más vendidos
- [ ] Alertas de stock bajo
- [ ] Ventas del mes actual

#### 11. **Historial de Ventas Mejorado**
- [ ] Paginación
- [ ] Búsqueda por código de venta
- [ ] Filtro por vendedor (admin)
- [ ] Filtro por rango de fechas

#### 12. **Validaciones Adicionales**
- [ ] Stock mínimo configurable
- [ ] Alertas de stock bajo
- [ ] Validación de precios

---

## 📁 ARCHIVOS A MODIFICAR

### Backend
```
backend/
├── routes/
│   ├── productos.js          # Agregar codigo_barra
│   ├── ventas.js             # Editar, eliminar, filtros
│   └── impresion.js          # NUEVO - Impresión de tickets
├── utils/
│   ├── printer.js            # NUEVO - Lógica de impresora
│   ├── pdf.js                # NUEVO - Generación PDF
│   └── excel.js              # NUEVO - Generación Excel
└── server.js                 # Agregar nuevas rutas
```

### Frontend
```
frontend/src/
├── components/
│   ├── BarcodeScanner.jsx    # NUEVO - Lector de códigos
│   ├── DateFilter.jsx        # NUEVO - Filtro de fechas
│   ├── ExportButtons.jsx     # NUEVO - Botones exportar
│   └── QuantitySelector.jsx  # NUEVO - Botones +/-
├── pages/
│   ├── Productos.jsx         # Agregar codigo_barra
│   ├── Ventas.jsx            # Filtros, editar, eliminar
│   ├── NuevaVenta.jsx        # Lector, autocompletado, +/-
│   └── Dashboard.jsx         # Gráficos y estadísticas
└── assets/
    └── logo.png              # NUEVO - Logo Licorería Cueva
```

### Database
```
database/
└── migrations/
    └── 001_add_codigo_barra.sql  # NUEVO - Migración
```

---

## 🔧 DEPENDENCIAS NUEVAS

### Backend
```json
{
  "escpos": "^3.0.0",           // Impresora térmica
  "escpos-usb": "^3.0.0",       // USB para impresora
  "pdfkit": "^0.13.0",          // Generación PDF
  "exceljs": "^4.3.0"           // Generación Excel
}
```

### Frontend
```json
{
  "react-datepicker": "^4.21.0",  // Selector de fechas
  "recharts": "^2.10.0",          // Gráficos
  "file-saver": "^2.0.5"          // Descargar archivos
}
```

---

## 📊 ESQUEMA DE BASE DE DATOS ACTUALIZADO

```sql
-- Agregar campo codigo_barra
ALTER TABLE productos 
ADD COLUMN codigo_barra VARCHAR(50) UNIQUE AFTER nombre,
ADD INDEX idx_codigo_barra (codigo_barra);

-- Actualizar productos existentes con códigos de ejemplo
UPDATE productos SET codigo_barra = CONCAT('7501234', LPAD(id_producto, 6, '0'));
```

---

## 🎨 DISEÑO DE TICKET

```
================================
    LICORERÍA CUEVA
================================
Fecha: 10/02/2026
Hora: 14:32
Venta: VENTA-00025
Vendedor: Juan
--------------------------------
Producto         Cant  Subtotal
Cerveza Pilsen    2      7.00
Gaseosa Inka      1      3.00
--------------------------------
TOTAL:           S/ 10.00
================================
  Gracias por su compra
================================
```

---

## 📅 CRONOGRAMA DE IMPLEMENTACIÓN

### Fase 1: Base de Datos (1 hora)
- [ ] Agregar campo `codigo_barra`
- [ ] Migración de datos
- [ ] Actualizar endpoints

### Fase 2: Backend Core (2 horas)
- [ ] Endpoints editar/eliminar ventas
- [ ] Filtros por fecha
- [ ] Validaciones adicionales

### Fase 3: Impresión (2 horas)
- [ ] Configurar impresora térmica
- [ ] Endpoint de impresión
- [ ] Formato de ticket

### Fase 4: Exportación (2 horas)
- [ ] Generación PDF
- [ ] Generación Excel
- [ ] Endpoints de descarga

### Fase 5: Frontend Mejoras (3 horas)
- [ ] Lector de códigos
- [ ] Filtro por fecha
- [ ] Botones +/-
- [ ] Autocompletado

### Fase 6: Branding (1 hora)
- [ ] Logo "Licorería Cueva"
- [ ] Actualizar textos
- [ ] Favicon

### Fase 7: Testing (1 hora)
- [ ] Pruebas de integración
- [ ] Pruebas de impresión
- [ ] Pruebas de exportación

**TOTAL ESTIMADO: 12 horas**

---

## ✅ CHECKLIST FINAL

### Funcionalidades POS
- [ ] Lector de códigos de barras funcional
- [ ] Impresora térmica configurada
- [ ] Tickets se imprimen automáticamente
- [ ] Búsqueda por código de barras
- [ ] Búsqueda por nombre con autocompletado
- [ ] Botones +/- para cantidad
- [ ] Filtro de ventas por fecha
- [ ] Resumen diario de ventas
- [ ] Editar ventas (admin)
- [ ] Eliminar ventas (admin)
- [ ] Reimprimir tickets
- [ ] Exportar a PDF
- [ ] Exportar a Excel
- [ ] Branding "Licorería Cueva"

### Calidad
- [ ] Código limpio y comentado
- [ ] Documentación actualizada
- [ ] README con nuevas funcionalidades
- [ ] Guía de configuración de impresora
- [ ] Guía de uso del lector

---

## 🚀 COMANDOS DE INICIO

```bash
# 1. Detener sistema actual
docker-compose down

# 2. Aplicar cambios
# (Los archivos se actualizarán)

# 3. Reconstruir e iniciar
docker-compose up --build

# 4. Verificar que todo funciona
# - Login: admin / admin123
# - Probar lector de códigos
# - Probar impresión de ticket
# - Probar exportación
```

---

## 📝 NOTAS IMPORTANTES

1. **Impresora Térmica**: Requiere configuración USB en el servidor
2. **Lector de Códigos**: Funciona como teclado, no requiere drivers
3. **Códigos de Barras**: Se generarán automáticamente si no existen
4. **Exportación**: Los archivos se descargan directamente al navegador
5. **Filtros**: Se mantienen en localStorage para persistencia

---

**Estado**: 🔴 PENDIENTE DE IMPLEMENTACIÓN
**Versión Objetivo**: 2.0.0
**Fecha**: Enero 2026
