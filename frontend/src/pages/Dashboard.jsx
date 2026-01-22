import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import ExportButtons from '../components/ExportButtons';

const Dashboard = () => {
    const { user, isAdmin } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [vistaActual, setVistaActual] = useState('general'); // general, mensual, diario

    useEffect(() => {
        if (isAdmin()) {
            loadStats();
        } else {
            setLoading(false);
        }
    }, []);

    const loadStats = async () => {
        try {
            const response = await api.get('/ventas/estadisticas/resumen');
            setStats(response.data);
        } catch (error) {
            console.error('Error cargando estadísticas:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderGeneral = () => (
        <>
            <div className="grid grid-3 mb-3">
                <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Total Ventas</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                        {stats.general.totalVentas.total || 0}
                    </p>
                    <p style={{ fontSize: '18px', opacity: 0.9 }}>
                        S/ {parseFloat(stats.general.totalVentas.monto || 0).toFixed(2)}
                    </p>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Productos Activos</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                        {stats.general.totalProductos || 0}
                    </p>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>En inventario</p>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Stock Bajo</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                        {stats.general.stockBajo || 0}
                    </p>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>Menos de 10 unidades</p>
                </div>
            </div>

            <div className="card">
                <h2 className="mb-2">📈 Productos Más Vendidos (General)</h2>
                {stats.general.productosMasVendidos.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad Vendida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.general.productosMasVendidos.map((producto, index) => (
                                    <tr key={index}>
                                        <td>{producto.nombre}</td>
                                        <td>
                                            <span className="badge badge-success">
                                                {producto.total_vendido} unidades
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No hay datos disponibles</p>
                )}
            </div>
        </>
    );

    const renderMensual = () => (
        <>
            <div className="grid grid-2 mb-3">
                <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Ventas del Mes</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                        {stats.mensual.ventas.total || 0}
                    </p>
                    <p style={{ fontSize: '18px', opacity: 0.9 }}>
                        S/ {parseFloat(stats.mensual.ventas.monto || 0).toFixed(2)}
                    </p>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Promedio por Venta</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                        S/ {stats.mensual.ventas.total > 0
                            ? (parseFloat(stats.mensual.ventas.monto) / stats.mensual.ventas.total).toFixed(2)
                            : '0.00'
                        }
                    </p>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>Este mes</p>
                </div>
            </div>

            <div className="card">
                <h2 className="mb-2">📊 Productos Más Vendidos del Mes</h2>
                {stats.mensual.productosMasVendidos.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad Vendida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.mensual.productosMasVendidos.map((producto, index) => (
                                    <tr key={index}>
                                        <td>{producto.nombre}</td>
                                        <td>
                                            <span className="badge badge-success">
                                                {producto.total_vendido} unidades
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No hay ventas este mes</p>
                )}
            </div>
        </>
    );

    const renderDiario = () => (
        <>
            <div className="grid grid-2 mb-3">
                <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Ventas Hoy</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                        {stats.diario.ventas.total || 0}
                    </p>
                    <p style={{ fontSize: '18px', opacity: 0.9 }}>
                        S/ {parseFloat(stats.diario.ventas.monto || 0).toFixed(2)}
                    </p>
                </div>

                <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Promedio Hoy</h3>
                    <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                        S/ {stats.diario.ventas.total > 0
                            ? (parseFloat(stats.diario.ventas.monto) / stats.diario.ventas.total).toFixed(2)
                            : '0.00'
                        }
                    </p>
                    <p style={{ fontSize: '14px', opacity: 0.9 }}>Por venta</p>
                </div>
            </div>

            <div className="card">
                <h2 className="mb-2">🔥 Productos Más Vendidos Hoy</h2>
                {stats.diario.productosMasVendidos.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Cantidad Vendida</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.diario.productosMasVendidos.map((producto, index) => (
                                    <tr key={index}>
                                        <td>{producto.nombre}</td>
                                        <td>
                                            <span className="badge badge-success">
                                                {producto.total_vendido} unidades
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p style={{ color: 'var(--text-secondary)' }}>No hay ventas hoy</p>
                )}
            </div>
        </>
    );

    if (loading) {
        return (
            <div className="flex-center" style={{ minHeight: '400px' }}>
                <div className="spinner"></div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex-between mb-3">
                <div>
                    <h1>Dashboard</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Bienvenido, {user?.nombre}
                    </p>
                </div>
                {isAdmin() && (
                    <ExportButtons tipo="dashboard" />
                )}
            </div>

            {isAdmin() && stats ? (
                <>
                    {/* Pestañas de navegación */}
                    <div style={{
                        display: 'flex',
                        gap: '12px',
                        marginBottom: '24px',
                        borderBottom: '2px solid var(--border-color)',
                        paddingBottom: '0'
                    }}>
                        <button
                            onClick={() => setVistaActual('general')}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                background: vistaActual === 'general' ? '#4f46e5' : 'transparent',
                                color: vistaActual === 'general' ? '#ffffff' : 'var(--text-primary)',
                                fontWeight: vistaActual === 'general' ? 'bold' : 'normal',
                                cursor: 'pointer',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.3s',
                                fontSize: '16px'
                            }}
                        >
                            📊 General
                        </button>
                        <button
                            onClick={() => setVistaActual('mensual')}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                background: vistaActual === 'mensual' ? '#4f46e5' : 'transparent',
                                color: vistaActual === 'mensual' ? '#ffffff' : 'var(--text-primary)',
                                fontWeight: vistaActual === 'mensual' ? 'bold' : 'normal',
                                cursor: 'pointer',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.3s',
                                fontSize: '16px'
                            }}
                        >
                            📅 Mensual
                        </button>
                        <button
                            onClick={() => setVistaActual('diario')}
                            style={{
                                padding: '12px 24px',
                                border: 'none',
                                background: vistaActual === 'diario' ? '#4f46e5' : 'transparent',
                                color: vistaActual === 'diario' ? '#ffffff' : 'var(--text-primary)',
                                fontWeight: vistaActual === 'diario' ? 'bold' : 'normal',
                                cursor: 'pointer',
                                borderRadius: '8px 8px 0 0',
                                transition: 'all 0.3s',
                                fontSize: '16px'
                            }}
                        >
                            🌞 Hoy
                        </button>
                    </div>

                    {/* Contenido según vista */}
                    {vistaActual === 'general' && renderGeneral()}
                    {vistaActual === 'mensual' && renderMensual()}
                    {vistaActual === 'diario' && renderDiario()}
                </>
            ) : (
                <div className="grid grid-2">
                    <div className="card">
                        <h2 className="mb-2">🎯 Acciones Rápidas</h2>
                        <div className="flex" style={{ flexDirection: 'column', gap: '12px' }}>
                            <a href="/ventas/nueva" className="btn btn-primary">
                                ➕ Nueva Venta
                            </a>
                            <a href="/ventas" className="btn btn-secondary">
                                📋 Ver Mis Ventas
                            </a>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="mb-2">ℹ️ Información</h2>
                        <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            Rol: <strong>{user?.rol}</strong>
                        </p>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Como vendedor puedes registrar ventas y ver tu historial.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;
