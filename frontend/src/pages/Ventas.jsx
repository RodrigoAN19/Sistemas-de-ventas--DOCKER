import { useState, useEffect } from 'react';
import api from '../api/axios';

const Ventas = () => {
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        loadVentas();
    }, []);

    const loadVentas = async () => {
        try {
            const response = await api.get('/ventas');
            setVentas(response.data);
        } catch (error) {
            console.error('Error cargando ventas:', error);
        } finally {
            setLoading(false);
        }
    };

    const viewDetalle = async (id) => {
        try {
            const response = await api.get(`/ventas/${id}`);
            setSelectedVenta(response.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error cargando detalle:', error);
        }
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-PE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div className="flex-between mb-3">
                <h1>📋 Ventas</h1>
                <a href="/ventas/nueva" className="btn btn-primary">
                    ➕ Nueva Venta
                </a>
            </div>

            <div className="card">
                {ventas.length === 0 ? (
                    <div className="text-center" style={{ padding: '40px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                            No hay ventas registradas
                        </p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Código</th>
                                    <th>Fecha</th>
                                    <th>Vendedor</th>
                                    <th>Total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventas.map(venta => (
                                    <tr key={venta.id_venta}>
                                        <td><strong>{venta.codigo_venta}</strong></td>
                                        <td>{formatFecha(venta.fecha)}</td>
                                        <td>{venta.vendedor}</td>
                                        <td>
                                            <span className="badge badge-success">
                                                S/ {parseFloat(venta.total).toFixed(2)}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => viewDetalle(venta.id_venta)}
                                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                            >
                                                👁️ Ver Detalle
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {showModal && selectedVenta && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-2">Detalle de Venta</h2>

                        <div className="mb-3" style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <p><strong>Código:</strong> {selectedVenta.venta.codigo_venta}</p>
                            <p><strong>Fecha:</strong> {formatFecha(selectedVenta.venta.fecha)}</p>
                            <p><strong>Total:</strong> S/ {parseFloat(selectedVenta.venta.total).toFixed(2)}</p>
                        </div>

                        <h3 className="mb-2">Productos</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Cantidad</th>
                                        <th>Precio Unit.</th>
                                        <th>Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedVenta.detalle.map(item => (
                                        <tr key={item.id_detalle}>
                                            <td>{item.producto}</td>
                                            <td>{item.cantidad}</td>
                                            <td>S/ {parseFloat(item.precio_unitario).toFixed(2)}</td>
                                            <td>S/ {parseFloat(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <button
                            className="btn btn-secondary mt-3"
                            onClick={() => setShowModal(false)}
                            style={{ width: '100%' }}
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ventas;
