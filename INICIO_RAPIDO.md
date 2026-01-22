# 🚀 INICIO RÁPIDO - Sistema de Ventas

## ⚡ 3 Pasos para Empezar

### 1️⃣ Abrir Terminal en la Carpeta del Proyecto

```bash
cd /d "D:\Proyectos Visual Studio\Sitemas de ventas(Andre)"

```

### 2️⃣ Iniciar Docker

```bash
docker-compose up --build
```

**Espera a ver estos mensajes:**
- ✅ `MySQL: ready for connections`
- ✅ `Servidor corriendo en puerto 5000`
- ✅ `Local: http://localhost:3000`

### 3️⃣ Abrir el Navegador

Ir a: **http://localhost:3000**

**Login:**
- Usuario: `admin`
- Contraseña: `admin123`

---

## 🎯 Primeros Pasos

### Como Administrador:

1. **Ver Dashboard** → Estadísticas del sistema
2. **Crear Productos** → Menú "📦 Productos" → Botón "➕ Nuevo Producto"
3. **Crear Vendedor** → Menú "👥 Usuarios" → Botón "➕ Nuevo Usuario"
4. **Registrar Venta** → Menú "➕ Nueva Venta"

### Como Vendedor:

1. **Registrar Venta** → Menú "➕ Nueva Venta"
2. **Ver Mis Ventas** → Menú "📋 Ventas"

---

## 🛑 Detener el Sistema

Presiona `Ctrl + C` en la terminal, luego:

```bash
docker-compose down
```

---

## 🔄 Reiniciar el Sistema

```bash
docker-compose restart
```

---

## 📖 Más Información

- **Guía Completa**: Ver `GUIA_DE_USO.md`
- **Documentación Técnica**: Ver `DOCUMENTACION_TECNICA.md`
- **README**: Ver `README.md`

---

## ⚠️ Problemas Comunes

### No carga la página
- Espera 1-2 minutos a que MySQL termine de inicializar
- Verifica que Docker Desktop esté corriendo

### Error de puerto ocupado
- Cambia los puertos en `docker-compose.yml`
- Ejemplo: `"3001:3000"` para usar puerto 3001

### No puedo hacer login
- Usuario: `admin` (todo en minúsculas)
- Contraseña: `admin123`

---

## 📞 Ayuda

Si tienes problemas, ejecuta:

```bash
docker-compose logs
```

Esto mostrará los logs de todos los servicios.

---

**¡Listo para usar! 🎉**
