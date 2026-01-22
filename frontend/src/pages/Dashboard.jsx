import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
    const { user, isAdmin } = useAuth();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

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
            </div>

            {isAdmin() && stats ? (
                <>
                    <div className="grid grid-3 mb-3">
                        <div className="card" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Total Ventas</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                                {stats.totalVentas.total || 0}
                            </p>
                            <p style={{ fontSize: '18px', opacity: 0.9 }}>
                                S/ {parseFloat(stats.totalVentas.monto || 0).toFixed(2)}
                            </p>
                        </div>

                        <div className="card" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', color: 'white' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Ventas Hoy</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                                {stats.ventasHoy.total || 0}
                            </p>
                            <p style={{ fontSize: '18px', opacity: 0.9 }}>
                                S/ {parseFloat(stats.ventasHoy.monto || 0).toFixed(2)}
                            </p>
                        </div>

                        <div className="card" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', color: 'white' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '8px', opacity: 0.9 }}>Promedio</h3>
                            <p style={{ fontSize: '32px', fontWeight: 'bold', margin: '8px 0' }}>
                                S/ {stats.totalVentas.total > 0
                                    ? (parseFloat(stats.totalVentas.monto) / stats.totalVentas.total).toFixed(2)
                                    : '0.00'
                                }
                            </p>
                            <p style={{ fontSize: '14px', opacity: 0.9 }}>Por venta</p>
                        </div>
                    </div>

                    <div className="card">
                        <h2 className="mb-2">📈 Productos Más Vendidos</h2>
                        {stats.productosMasVendidos.length > 0 ? (
                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Producto</th>
                                            <th>Cantidad Vendida</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.productosMasVendidos.map((producto, index) => (
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
