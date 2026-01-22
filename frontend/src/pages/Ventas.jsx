import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import DateFilter from '../components/DateFilter';
import ExportButtons from '../components/ExportButtons';

const Ventas = () => {
    const { user } = useAuth();
    const [ventas, setVentas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedVenta, setSelectedVenta] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingVenta, setEditingVenta] = useState(null);
    const [editProductos, setEditProductos] = useState([]);
    const [fechaFiltro, setFechaFiltro] = useState('');
    const [resumenDia, setResumenDia] = useState(null);

    useEffect(() => {
        loadVentas();
    }, []);

    const loadVentas = async (fecha = '') => {
        try {
            setLoading(true);
            const url = fecha ? `/ventas?fecha=${fecha}` : '/ventas';
            const response = await api.get(url);
            setVentas(response.data);
        } catch (error) {
            console.error('Error cargando ventas:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleFechaChange = async (fecha) => {
        setFechaFiltro(fecha);
        await loadVentas(fecha);

        // Cargar resumen si hay fecha y es admin
        if (fecha && user?.rol === 'administrador') {
            try {
                const response = await api.get(`/ventas/estadisticas/resumen-dia?fecha=${fecha}`);
                setResumenDia(response.data);
            } catch (error) {
                console.error('Error cargando resumen:', error);
                setResumenDia(null);
            }
        } else {
            setResumenDia(null);
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

    const reimprimirTicket = async (codigo) => {
        try {
            await api.post(`/impresion/reimprimir/${codigo}`);
            alert('✅ Ticket reimpreso correctamente');
        } catch (error) {
            console.error('Error reimprimiendo ticket:', error);
            alert('⚠️ No se pudo reimprimir el ticket');
        }
    };

    const eliminarVenta = async (id, codigo) => {
        if (!confirm(`¿Eliminar la venta ${codigo}?\n\nEl stock será restaurado automáticamente.`)) {
            return;
        }

        try {
            await api.delete(`/ventas/${id}`);
            alert('✅ Venta eliminada correctamente');
            loadVentas(fechaFiltro);
        } catch (error) {
            console.error('Error eliminando venta:', error);
            alert('❌ Error al eliminar la venta');
        }
    };

    const editarVenta = async (venta) => {
        try {
            // Cargar detalles completos
            const response = await api.get(`/ventas/${venta.id_venta}`);
            setEditingVenta({ ...venta, detalle: response.data.detalle });
            setEditProductos(response.data.detalle.map(d => ({
                id_detalle: d.id_detalle,
                id_producto: d.id_producto,
                producto: d.producto,
                cantidad: d.cantidad,
                precio_unitario: d.precio_unitario,
                subtotal: d.subtotal
            })));
            setShowEditModal(true);
        } catch (error) {
            console.error('Error cargando venta:', error);
            alert('Error al cargar la venta');
        }
    };

    const actualizarCantidadEdit = (index, nuevaCantidad) => {
        const newProductos = [...editProductos];
        newProductos[index].cantidad = parseInt(nuevaCantidad) || 0;
        newProductos[index].subtotal = newProductos[index].cantidad * newProductos[index].precio_unitario;
        setEditProductos(newProductos);
    };

    const eliminarProductoEdit = (index) => {
        setEditProductos(editProductos.filter((_, i) => i !== index));
    };

    const guardarEdicion = async () => {
        if (editProductos.length === 0) {
            alert('Debe haber al menos un producto');
            return;
        }

        try {
            const productos = editProductos.map(p => ({
                id_producto: p.id_producto,
                cantidad: p.cantidad
            }));

            await api.put(`/ventas/${editingVenta.id_venta}`, { productos });
            alert('✅ Venta editada correctamente');
            loadVentas(fechaFiltro);
            setShowEditModal(false);
            setEditingVenta(null);
            setEditProductos([]);
        } catch (error) {
            console.error('Error editando venta:', error);
            alert('❌ Error al editar la venta: ' + (error.response?.data?.error || 'Error desconocido'));
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

    const isAdmin = user?.rol === 'administrador';

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div className="flex-between mb-3">
                <h1>📋 Ventas</h1>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <ExportButtons tipo="ventas" fecha={fechaFiltro} />
                    <a href="/ventas/nueva" className="btn btn-primary">
                        ➕ Nueva Venta
                    </a>
                </div>
            </div>

            {/* Filtro por fecha */}
            <DateFilter onDateChange={handleFechaChange} resumen={resumenDia} />

            {/* Indicador de fecha seleccionada */}
            {fechaFiltro && (
                <div style={{
                    padding: '12px 20px',
                    backgroundColor: '#4f46e5',
                    color: '#ffffff',
                    borderRadius: '8px',
                    marginBottom: '20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
                }}>
                    <span style={{ fontWeight: '500' }}>
                        📅 Mostrando ventas del: <strong>{new Date(fechaFiltro + 'T00:00:00').toLocaleDateString('es-PE', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}</strong>
                    </span>
                    <span style={{ fontSize: '14px', opacity: 0.95, fontWeight: '500' }}>
                        {ventas.length} venta{ventas.length !== 1 ? 's' : ''} encontrada{ventas.length !== 1 ? 's' : ''}
                    </span>
                </div>
            )}

            <div className="card">
                {ventas.length === 0 ? (
                    <div className="text-center" style={{ padding: '40px' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
                            {fechaFiltro ? 'No hay ventas en esta fecha' : 'No hay ventas registradas'}
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
                                            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                                <button
                                                    className="btn btn-primary"
                                                    onClick={() => viewDetalle(venta.id_venta)}
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                >
                                                    👁️ Ver
                                                </button>
                                                <button
                                                    className="btn btn-secondary"
                                                    onClick={() => reimprimirTicket(venta.codigo_venta)}
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                    title="Reimprimir ticket"
                                                >
                                                    🖨️
                                                </button>
                                                {isAdmin && (
                                                    <>
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => editarVenta(venta)}
                                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                                            title="Editar venta"
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            className="btn btn-danger"
                                                            onClick={() => eliminarVenta(venta.id_venta, venta.codigo_venta)}
                                                            style={{ padding: '6px 12px', fontSize: '12px' }}
                                                            title="Eliminar venta"
                                                        >
                                                            🗑️
                                                        </button>
                                                    </>
                                                )}
                                            </div>
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

                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => reimprimirTicket(selectedVenta.venta.codigo_venta)}
                                style={{ flex: 1 }}
                            >
                                🖨️ Reimprimir Ticket
                            </button>
                            <button
                                className="btn btn-primary"
                                onClick={() => setShowModal(false)}
                                style={{ flex: 1 }}
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Edición */}
            {showEditModal && editingVenta && (
                <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
                        <h2 className="mb-2">✏️ Editar Venta</h2>

                        <div className="mb-3" style={{ padding: '16px', backgroundColor: 'var(--bg-tertiary)', borderRadius: '8px' }}>
                            <p><strong>Código:</strong> {editingVenta.codigo_venta}</p>
                            <p><strong>Fecha:</strong> {formatFecha(editingVenta.fecha)}</p>
                        </div>

                        <h3 className="mb-2">Productos</h3>
                        <div className="table-container">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Producto</th>
                                        <th>Precio Unit.</th>
                                        <th>Cantidad</th>
                                        <th>Subtotal</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {editProductos.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.producto}</td>
                                            <td>S/ {parseFloat(item.precio_unitario).toFixed(2)}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={item.cantidad}
                                                    onChange={(e) => actualizarCantidadEdit(index, e.target.value)}
                                                    style={{
                                                        width: '80px',
                                                        padding: '6px',
                                                        borderRadius: '4px',
                                                        border: '1px solid var(--border-color)',
                                                        backgroundColor: 'var(--bg-secondary)',
                                                        color: 'var(--text-primary)'
                                                    }}
                                                />
                                            </td>
                                            <td>
                                                <strong>S/ {parseFloat(item.subtotal).toFixed(2)}</strong>
                                            </td>
                                            <td>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => eliminarProductoEdit(index)}
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                >
                                                    🗑️
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div style={{
                            marginTop: '20px',
                            padding: '16px',
                            backgroundColor: 'var(--bg-tertiary)',
                            borderRadius: '8px',
                            textAlign: 'right'
                        }}>
                            <h3>Total: S/ {editProductos.reduce((sum, p) => sum + parseFloat(p.subtotal), 0).toFixed(2)}</h3>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
                            <button
                                className="btn btn-secondary"
                                onClick={() => {
                                    setShowEditModal(false);
                                    setEditingVenta(null);
                                    setEditProductos([]);
                                }}
                                style={{ flex: 1 }}
                            >
                                ❌ Cancelar
                            </button>
                            <button
                                className="btn btn-success"
                                onClick={guardarEdicion}
                                style={{ flex: 1 }}
                            >
                                💾 Guardar Cambios
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Ventas;
