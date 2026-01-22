// Script para crear usuario administrador con hash correcto
// Ejecutar: node setup-admin.js

const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function setupAdmin() {
    try {
        console.log('🔧 Configurando usuario administrador...\n');

        // Conectar a la base de datos
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'ventas_user',
            password: process.env.DB_PASSWORD || 'ventas_pass',
            database: process.env.DB_NAME || 'sistema_ventas',
            port: process.env.DB_PORT || 3306
        });

        console.log('✅ Conectado a la base de datos\n');

        // Generar hash para la contraseña
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        console.log('🔐 Hash generado para contraseña: admin123');
        console.log('Hash:', hashedPassword, '\n');

        // Eliminar usuario admin si existe
        await connection.execute('DELETE FROM usuarios WHERE usuario = ?', ['admin']);
        console.log('🗑️  Usuario admin anterior eliminado (si existía)\n');

        // Insertar nuevo usuario admin
        await connection.execute(
            'INSERT INTO usuarios (nombre, usuario, password, rol) VALUES (?, ?, ?, ?)',
            ['Administrador', 'admin', hashedPassword, 'administrador']
        );

        console.log('✅ Usuario administrador creado exitosamente!\n');
        console.log('📝 Credenciales:');
        console.log('   Usuario: admin');
        console.log('   Contraseña: admin123\n');

        await connection.end();
        console.log('✅ Proceso completado!\n');

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setupAdmin();
