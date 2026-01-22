import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import ExportButtons from '../components/ExportButtons';

const Productos = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        codigo_barra: '',
        precio: '',
        stock: '',
        estado: 'activo'
    });

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/dashboard');
            return;
        }
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            const response = await api.get('/productos/todos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingProduct) {
                await api.put(`/productos/${editingProduct.id_producto}`, formData);
            } else {
                await api.post('/productos', formData);
            }

            setShowModal(false);
            resetForm();
            loadProductos();
        } catch (error) {
            console.error('Error guardando producto:', error);
            alert(error.response?.data?.error || 'Error al guardar producto');
        }
    };

    const handleEdit = (producto) => {
        setEditingProduct(producto);
        setFormData({
            nombre: producto.nombre,
            codigo_barra: producto.codigo_barra || '',
            precio: producto.precio,
            stock: producto.stock,
            estado: producto.estado
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de desactivar este producto?')) return;

        try {
            await api.delete(`/productos/${id}`);
            loadProductos();
        } catch (error) {
            console.error('Error eliminando producto:', error);
        }
    };

    const resetForm = () => {
        setFormData({ nombre: '', codigo_barra: '', precio: '', stock: '', estado: 'activo' });
        setEditingProduct(null);
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div className="flex-between mb-3">
                <h1>📦 Productos</h1>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <ExportButtons tipo="productos" />
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            resetForm();
                            setShowModal(true);
                        }}
                    >
                        ➕ Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Código Barras</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productos.map(producto => (
                                <tr key={producto.id_producto}>
                                    <td>{producto.id_producto}</td>
                                    <td>{producto.nombre}</td>
                                    <td>
                                        <code style={{ fontSize: '12px', padding: '2px 6px', background: 'var(--bg-tertiary)', borderRadius: '4px' }}>
                                            {producto.codigo_barra || 'N/A'}
                                        </code>
                                    </td>
                                    <td>S/ {parseFloat(producto.precio).toFixed(2)}</td>
                                    <td>
                                        <span className={`badge ${producto.stock > 10 ? 'badge-success' : producto.stock > 0 ? 'badge-primary' : 'badge-danger'}`}>
                                            {producto.stock} unidades
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`badge ${producto.estado === 'activo' ? 'badge-success' : 'badge-danger'}`}>
                                            {producto.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleEdit(producto)}
                                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                            >
                                                ✏️ Editar
                                            </button>
                                            {producto.estado === 'activo' && (
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => handleDelete(producto.id_producto)}
                                                    style={{ padding: '6px 12px', fontSize: '12px' }}
                                                >
                                                    🗑️ Desactivar
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-3">{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Nombre</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Código de Barras (opcional)</label>
                                <input
                                    type="text"
                                    value={formData.codigo_barra}
                                    onChange={(e) => setFormData({ ...formData, codigo_barra: e.target.value })}
                                    placeholder="Ej: 7750186002011"
                                />
                                <small style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                    Deja vacío para generar automáticamente
                                </small>
                            </div>

                            <div className="input-group">
                                <label>Precio</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.precio}
                                    onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    required
                                />
                            </div>

                            {editingProduct && (
                                <div className="input-group">
                                    <label>Estado</label>
                                    <select
                                        value={formData.estado}
                                        onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                                    >
                                        <option value="activo">Activo</option>
                                        <option value="inactivo">Inactivo</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <button type="submit" className="btn btn-success" style={{ flex: 1 }}>
                                    💾 Guardar
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                    style={{ flex: 1 }}
                                >
                                    ❌ Cancelar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Productos;
