import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './NuevaVenta.css';

const NuevaVenta = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState('');
    const [cantidad, setCantidad] = useState(1);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        loadProductos();
    }, []);

    const loadProductos = async () => {
        try {
            const response = await api.get('/productos');
            setProductos(response.data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    const agregarAlCarrito = () => {
        if (!selectedProducto) {
            alert('Selecciona un producto');
            return;
        }

        const producto = productos.find(p => p.id_producto === parseInt(selectedProducto));

        if (!producto) return;

        if (cantidad <= 0) {
            alert('La cantidad debe ser mayor a 0');
            return;
        }

        if (cantidad > producto.stock) {
            alert(`Stock insuficiente. Disponible: ${producto.stock}`);
            return;
        }

        // Verificar si ya está en el carrito
        const existeEnCarrito = carrito.find(item => item.id_producto === producto.id_producto);

        if (existeEnCarrito) {
            const nuevaCantidad = existeEnCarrito.cantidad + cantidad;
            if (nuevaCantidad > producto.stock) {
                alert(`Stock insuficiente. Disponible: ${producto.stock}`);
                return;
            }

            setCarrito(carrito.map(item =>
                item.id_producto === producto.id_producto
                    ? { ...item, cantidad: nuevaCantidad }
                    : item
            ));
        } else {
            setCarrito([...carrito, {
                id_producto: producto.id_producto,
                nombre: producto.nombre,
                precio_unitario: producto.precio,
                cantidad: cantidad,
                stock: producto.stock
            }]);
        }

        setSelectedProducto('');
        setCantidad(1);
    };

    const eliminarDelCarrito = (id) => {
        setCarrito(carrito.filter(item => item.id_producto !== id));
    };

    const actualizarCantidad = (id, nuevaCantidad) => {
        const item = carrito.find(i => i.id_producto === id);

        if (nuevaCantidad <= 0) {
            eliminarDelCarrito(id);
            return;
        }

        if (nuevaCantidad > item.stock) {
            alert(`Stock insuficiente. Disponible: ${item.stock}`);
            return;
        }

        setCarrito(carrito.map(item =>
            item.id_producto === id
                ? { ...item, cantidad: nuevaCantidad }
                : item
        ));
    };

    const calcularTotal = () => {
        return carrito.reduce((total, item) => total + (item.precio_unitario * item.cantidad), 0);
    };

    const registrarVenta = async () => {
        if (carrito.length === 0) {
            alert('Agrega al menos un producto');
            return;
        }

        setLoading(true);

        try {
            await api.post('/ventas', { productos: carrito });
            setSuccess(true);

            setTimeout(() => {
                navigate('/ventas');
            }, 2000);
        } catch (error) {
            console.error('Error registrando venta:', error);
            alert(error.response?.data?.error || 'Error al registrar venta');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex-center" style={{ minHeight: '400px', flexDirection: 'column', gap: '20px' }}>
                <div style={{ fontSize: '64px' }}>✅</div>
                <h2>¡Venta registrada exitosamente!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>Redirigiendo...</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex-between mb-3">
                <h1>➕ Nueva Venta</h1>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/ventas')}
                >
                    ← Volver
                </button>
            </div>

            <div className="grid grid-2">
                {/* Panel de selección */}
                <div className="card">
                    <h2 className="mb-3">Agregar Productos</h2>

                    <div className="input-group">
                        <label>Producto</label>
                        <select
                            value={selectedProducto}
                            onChange={(e) => setSelectedProducto(e.target.value)}
                        >
                            <option value="">Selecciona un producto</option>
                            {productos.map(producto => (
                                <option key={producto.id_producto} value={producto.id_producto}>
                                    {producto.nombre} - S/ {parseFloat(producto.precio).toFixed(2)} (Stock: {producto.stock})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group">
                        <label>Cantidad</label>
                        <input
                            type="number"
                            min="1"
                            value={cantidad}
                            onChange={(e) => setCantidad(parseInt(e.target.value) || 1)}
                        />
                    </div>

                    <button
                        className="btn btn-primary"
                        onClick={agregarAlCarrito}
                        style={{ width: '100%' }}
                    >
                        ➕ Agregar al Carrito
                    </button>
                </div>

                {/* Carrito */}
                <div className="card">
                    <h2 className="mb-3">🛒 Carrito de Compra</h2>

                    {carrito.length === 0 ? (
                        <div className="text-center" style={{ padding: '40px', color: 'var(--text-secondary)' }}>
                            El carrito está vacío
                        </div>
                    ) : (
                        <>
                            <div className="carrito-items">
                                {carrito.map(item => (
                                    <div key={item.id_producto} className="carrito-item">
                                        <div>
                                            <strong>{item.nombre}</strong>
                                            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
                                                S/ {parseFloat(item.precio_unitario).toFixed(2)} c/u
                                            </p>
                                        </div>

                                        <div className="carrito-item-actions">
                                            <div className="cantidad-control">
                                                <button
                                                    onClick={() => actualizarCantidad(item.id_producto, item.cantidad - 1)}
                                                    className="btn-cantidad"
                                                >
                                                    -
                                                </button>
                                                <span className="cantidad-display">{item.cantidad}</span>
                                                <button
                                                    onClick={() => actualizarCantidad(item.id_producto, item.cantidad + 1)}
                                                    className="btn-cantidad"
                                                >
                                                    +
                                                </button>
                                            </div>

                                            <div>
                                                <strong>S/ {(item.precio_unitario * item.cantidad).toFixed(2)}</strong>
                                            </div>

                                            <button
                                                onClick={() => eliminarDelCarrito(item.id_producto)}
                                                className="btn btn-danger"
                                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="carrito-total">
                                <h3>Total: S/ {calcularTotal().toFixed(2)}</h3>
                            </div>

                            <button
                                className="btn btn-success"
                                onClick={registrarVenta}
                                disabled={loading}
                                style={{ width: '100%', fontSize: '16px', padding: '14px' }}
                            >
                                {loading ? '⏳ Procesando...' : '💰 Registrar Venta'}
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default NuevaVenta;
