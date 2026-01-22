# 🔧 SOLUCIÓN: Problema de Login Admin

## ❌ Problema
No puedes iniciar sesión con:
- Usuario: `admin`
- Contraseña: `admin123`
- Error: "Credenciales inválidas"

## ✅ SOLUCIÓN RÁPIDA

### Opción 1: Ejecutar Script de Configuración (RECOMENDADO)

1. **Asegúrate de que Docker esté corriendo:**
   ```bash
   docker-compose up -d
   ```

2. **Espera 30 segundos** a que MySQL esté listo

3. **Ejecuta el script de configuración:**
   ```bash
   docker exec -it ventas_backend node setup-admin.js
   ```

4. **Verás este mensaje:**
   ```
   ✅ Usuario administrador creado exitosamente!
   
   📝 Credenciales:
      Usuario: admin
      Contraseña: admin123
   ```

5. **Ahora intenta hacer login** en http://localhost:3000

---

### Opción 2: Recrear la Base de Datos

Si la Opción 1 no funciona:

1. **Detener y eliminar todo:**
   ```bash
   docker-compose down -v
   ```

2. **Volver a iniciar:**
   ```bash
   docker-compose up --build
   ```

3. **Esperar a que aparezcan estos mensajes:**
   - ✅ MySQL: "ready for connections"
   - ✅ Backend: "Servidor corriendo en puerto 5000"
   - ✅ Frontend: "Local: http://localhost:3000"

4. **Ejecutar el script de configuración:**
   ```bash
   docker exec -it ventas_backend node setup-admin.js
   ```

5. **Intentar login** en http://localhost:3000

---

### Opción 3: Crear Usuario desde MySQL

1. **Conectar a MySQL:**
   ```bash
   docker exec -it ventas_db mysql -u ventas_user -pventas_pass sistema_ventas
   ```

2. **Ejecutar estos comandos:**
   ```sql
   DELETE FROM usuarios WHERE usuario = 'admin';
   
   -- Salir de MySQL
   exit;
   ```

3. **Ejecutar el script de configuración:**
   ```bash
   docker exec -it ventas_backend node setup-admin.js
   ```

---

## 🔍 Verificar que Funcionó

1. Ir a http://localhost:3000
2. Ingresar:
   - Usuario: `admin`
   - Contraseña: `admin123`
3. Deberías ver el Dashboard

---

## 📝 Notas Importantes

- El hash de bcrypt debe generarse con el backend corriendo
- El script `setup-admin.js` genera el hash correcto automáticamente
- Si cambias la contraseña, usa el mismo script

---

## 🆘 Si Aún No Funciona

1. **Verificar que los contenedores estén corriendo:**
   ```bash
   docker-compose ps
   ```

2. **Ver logs del backend:**
   ```bash
   docker-compose logs backend
   ```

3. **Ver logs de MySQL:**
   ```bash
   docker-compose logs db
   ```

4. **Reiniciar todo:**
   ```bash
   docker-compose restart
   ```

---

## ✅ Solución Permanente

El archivo `init.sql` tiene un hash que puede no funcionar. El script `setup-admin.js` soluciona esto generando el hash correcto cada vez.

**Recomendación:** Después de iniciar Docker por primera vez, siempre ejecuta:
```bash
docker exec -it ventas_backend node setup-admin.js
```

Esto garantiza que el usuario admin tenga la contraseña correcta.
