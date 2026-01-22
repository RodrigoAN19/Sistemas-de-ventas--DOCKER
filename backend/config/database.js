const mysql = require('mysql2');

// Configuración de la conexión
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'ventas_user',
    password: process.env.DB_PASSWORD || 'ventas_pass',
    database: process.env.DB_NAME || 'sistema_ventas',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Promisify para usar async/await
const promisePool = pool.promise();

// Verificar conexión
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Error conectando a la base de datos:', err.message);
        return;
    }
    console.log('✅ Conexión exitosa a MySQL');
    connection.release();
});

module.exports = promisePool;
