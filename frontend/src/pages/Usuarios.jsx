import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Usuarios = () => {
    const { isAdmin } = useAuth();
    const navigate = useNavigate();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        usuario: '',
        password: '',
        rol: 'vendedor'
    });

    useEffect(() => {
        if (!isAdmin()) {
            navigate('/dashboard');
            return;
        }
        loadUsuarios();
    }, []);

    const loadUsuarios = async () => {
        try {
            const response = await api.get('/usuarios');
            setUsuarios(response.data);
        } catch (error) {
            console.error('Error cargando usuarios:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingUser) {
                await api.put(`/usuarios/${editingUser.id_usuario}`, formData);
            } else {
                await api.post('/usuarios', formData);
            }

            setShowModal(false);
            resetForm();
            loadUsuarios();
        } catch (error) {
            console.error('Error guardando usuario:', error);
            alert(error.response?.data?.error || 'Error al guardar usuario');
        }
    };

    const handleEdit = (usuario) => {
        setEditingUser(usuario);
        setFormData({
            nombre: usuario.nombre,
            usuario: usuario.usuario,
            password: '',
            rol: usuario.rol
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

        try {
            await api.delete(`/usuarios/${id}`);
            loadUsuarios();
        } catch (error) {
            console.error('Error eliminando usuario:', error);
            alert(error.response?.data?.error || 'Error al eliminar usuario');
        }
    };

    const resetForm = () => {
        setFormData({ nombre: '', usuario: '', password: '', rol: 'vendedor' });
        setEditingUser(null);
    };

    const formatFecha = (fecha) => {
        return new Date(fecha).toLocaleDateString('es-PE');
    };

    if (loading) {
        return <div className="flex-center" style={{ minHeight: '400px' }}><div className="spinner"></div></div>;
    }

    return (
        <div>
            <div className="flex-between mb-3">
                <h1>👥 Usuarios</h1>
                <button
                    className="btn btn-primary"
                    onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}
                >
                    ➕ Nuevo Usuario
                </button>
            </div>

            <div className="card">
                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nombre</th>
                                <th>Usuario</th>
                                <th>Rol</th>
                                <th>Fecha Creación</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usuarios.map(usuario => (
                                <tr key={usuario.id_usuario}>
                                    <td>{usuario.id_usuario}</td>
                                    <td>{usuario.nombre}</td>
                                    <td><code>{usuario.usuario}</code></td>
                                    <td>
                                        <span className={`badge ${usuario.rol === 'administrador' ? 'badge-primary' : 'badge-success'}`}>
                                            {usuario.rol}
                                        </span>
                                    </td>
                                    <td>{formatFecha(usuario.fecha_creacion)}</td>
                                    <td>
                                        <div className="flex gap-1">
                                            <button
                                                className="btn btn-primary"
                                                onClick={() => handleEdit(usuario)}
                                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                            >
                                                ✏️ Editar
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(usuario.id_usuario)}
                                                style={{ padding: '6px 12px', fontSize: '12px' }}
                                            >
                                                🗑️ Eliminar
                                            </button>
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
                        <h2 className="mb-3">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>

                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Nombre Completo</label>
                                <input
                                    type="text"
                                    value={formData.nombre}
                                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Usuario</label>
                                <input
                                    type="text"
                                    value={formData.usuario}
                                    onChange={(e) => setFormData({ ...formData, usuario: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="input-group">
                                <label>Contraseña {editingUser && '(dejar vacío para no cambiar)'}</label>
                                <input
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingUser}
                                />
                            </div>

                            <div className="input-group">
                                <label>Rol</label>
                                <select
                                    value={formData.rol}
                                    onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
                                >
                                    <option value="vendedor">Vendedor</option>
                                    <option value="administrador">Administrador</option>
                                </select>
                            </div>

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

export default Usuarios;
