import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import BarcodeScanner from '../components/BarcodeScanner';
import QuantitySelector from '../components/QuantitySelector';
import './NuevaVenta.css';

const NuevaVenta = () => {
    const navigate = useNavigate();
    const [productos, setProductos] = useState([]);
    const [productosFiltrados, setProductosFiltrados] = useState([]);
    const [carrito, setCarrito] = useState([]);
    const [selectedProducto, setSelectedProducto] = useState('');
    const [searchText, setSearchText] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
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
            setProductosFiltrados(response.data);
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
    };

    // Búsqueda por texto
    const handleSearchChange = (e) => {
        const text = e.target.value;
        setSearchText(text);

        if (text.trim() === '') {
            setProductosFiltrados(productos);
            setShowSuggestions(false);
            return;
        }

        // Filtrar productos por nombre
        const filtrados = productos.filter(p =>
            p.nombre.toLowerCase().includes(text.toLowerCase()) ||
            (p.codigo_barra && p.codigo_barra.includes(text))
        );

        setProductosFiltrados(filtrados);
        setShowSuggestions(true);
    };

    // Seleccionar producto desde sugerencias
    const seleccionarProducto = (producto) => {
        setSelectedProducto(producto.id_producto.toString());
        setSearchText(producto.nombre);
        setShowSuggestions(false);
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

    // Buscar producto por código de barras
    const buscarPorCodigo = async (codigo) => {
        try {
            const response = await api.get(`/productos/buscar/${codigo}`);
            const producto = response.data;

            // Verificar stock
            if (producto.stock <= 0) {
                alert(`Producto sin stock: ${producto.nombre}`);
                return;
            }

            // Agregar al carrito automáticamente
            const existeEnCarrito = carrito.find(item => item.id_producto === producto.id_producto);

            if (existeEnCarrito) {
                const nuevaCantidad = existeEnCarrito.cantidad + 1;
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
                    cantidad: 1,
                    stock: producto.stock
                }]);
            }

            console.log(`✅ Producto agregado: ${producto.nombre}`);
        } catch (error) {
            console.error('Error buscando producto:', error);
            alert('Producto no encontrado');
        }
    };

    const registrarVenta = async () => {
        if (carrito.length === 0) {
            alert('Agrega al menos un producto');
            return;
        }

        setLoading(true);

        try {
            const response = await api.post('/ventas', { productos: carrito });
            const ventaId = response.data.venta.id;

            // Intentar imprimir ticket automáticamente
            try {
                await api.post(`/impresion/ticket/${ventaId}`);
                console.log('✅ Ticket impreso');
            } catch (printError) {
                console.warn('⚠️ No se pudo imprimir el ticket:', printError);
                // No bloqueamos la venta si falla la impresión
            }

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

                    {/* Método 1: Lector de códigos de barras */}
                    <div className="input-group">
                        <label>🔍 Método 1: Escanear Código de Barras</label>
                        <BarcodeScanner onScan={buscarPorCodigo} />
                        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>
                            Escanea el código de barras del producto
                        </p>
                    </div>

                    <div style={{ margin: '20px 0', borderTop: '1px solid var(--border-color)' }}></div>

                    {/* Método 2: Búsqueda por texto con autocompletado */}
                    <div className="input-group" style={{ position: 'relative' }}>
                        <label>⌨️ Método 2: Buscar escribiendo</label>
                        <input
                            type="text"
                            value={searchText}
                            onChange={handleSearchChange}
                            onFocus={() => searchText && setShowSuggestions(true)}
                            placeholder="Escribe el nombre del producto..."
                            autoComplete="off"
                        />

                        {/* Sugerencias de autocompletado */}
                        {showSuggestions && productosFiltrados.length > 0 && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                left: 0,
                                right: 0,
                                backgroundColor: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                maxHeight: '200px',
                                overflowY: 'auto',
                                zIndex: 1000,
                                marginTop: '4px',
                                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                            }}>
                                {productosFiltrados.map(producto => (
                                    <div
                                        key={producto.id_producto}
                                        onClick={() => seleccionarProducto(producto)}
                                        style={{
                                            padding: '12px',
                                            cursor: 'pointer',
                                            borderBottom: '1px solid var(--border-color)',
                                            transition: 'background 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.target.style.backgroundColor = 'var(--bg-tertiary)'}
                                        onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                                    >
                                        <div style={{ fontWeight: 'bold' }}>{producto.nombre}</div>
                                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                                            S/ {parseFloat(producto.precio).toFixed(2)} - Stock: {producto.stock}
                                            {producto.codigo_barra && ` - Código: ${producto.codigo_barra}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div style={{ margin: '20px 0', borderTop: '1px solid var(--border-color)' }}></div>

                    {/* Método 3: Selección desde lista */}
                    <div className="input-group">
                        <label>📋 Método 3: Seleccionar de la lista</label>
                        <select
                            value={selectedProducto}
                            onChange={(e) => {
                                setSelectedProducto(e.target.value);
                                const prod = productos.find(p => p.id_producto === parseInt(e.target.value));
                                if (prod) setSearchText(prod.nombre);
                            }}
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
                        <QuantitySelector
                            value={cantidad}
                            onChange={setCantidad}
                            min={1}
                            max={999}
                            stock={selectedProducto ? productos.find(p => p.id_producto === parseInt(selectedProducto))?.stock || 999 : 999}
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
