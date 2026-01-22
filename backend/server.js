const express = require('express');
const session = require('express-session');
const cors = require('cors');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuración de sesiones
app.use(session({
    secret: process.env.SESSION_SECRET || 'ventas_secret_key_2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true en producción con HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 8 // 8 horas
    }
}));

// Middleware de autenticación
const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.userId) {
        return next();
    }
    return res.status(401).json({ error: 'No autenticado' });
};

// Middleware de autorización (solo administrador)
const isAdmin = (req, res, next) => {
    if (req.session && req.session.rol === 'administrador') {
        return next();
    }
    return res.status(403).json({ error: 'Acceso denegado. Solo administradores.' });
};

// Rutas
const authRoutes = require('./routes/auth');
const productosRoutes = require('./routes/productos');
const ventasRoutes = require('./routes/ventas');
const usuariosRoutes = require('./routes/usuarios');
const exportarRoutes = require('./routes/exportar');
const impresionRoutes = require('./routes/impresion');

app.use('/api/auth', authRoutes);
app.use('/api/productos', isAuthenticated, productosRoutes);
app.use('/api/ventas', isAuthenticated, ventasRoutes);
app.use('/api/usuarios', isAuthenticated, isAdmin, usuariosRoutes);
app.use('/api/exportar', isAuthenticated, exportarRoutes);
app.use('/api/impresion', isAuthenticated, impresionRoutes);

// Ruta de prueba
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Sistema de ventas funcionando' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    console.log(`🔗 http://localhost:${PORT}`);
});

// Manejo de errores
process.on('uncaughtException', (error) => {
    console.error('❌ Error no capturado:', error);
});

process.on('unhandledRejection', (error) => {
    console.error('❌ Promesa rechazada:', error);
});
