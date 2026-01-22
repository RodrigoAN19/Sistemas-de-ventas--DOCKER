import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Layout.css';

const Layout = ({ children }) => {
    const { user, logout, isAdmin } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    return (
        <div className="layout">
            <aside className="sidebar">
                <div className="sidebar-header">
                    <h2>🛒 Sistema Ventas</h2>
                    <p className="user-info">{user?.nombre}</p>
                    <span className={`badge ${isAdmin() ? 'badge-primary' : 'badge-success'}`}>
                        {user?.rol}
                    </span>
                </div>

                <nav className="sidebar-nav">
                    <Link
                        to="/dashboard"
                        className={`nav-item ${isActive('/dashboard') ? 'active' : ''}`}
                    >
                        📊 Dashboard
                    </Link>

                    <Link
                        to="/ventas/nueva"
                        className={`nav-item ${isActive('/ventas/nueva') ? 'active' : ''}`}
                    >
                        ➕ Nueva Venta
                    </Link>

                    <Link
                        to="/ventas"
                        className={`nav-item ${isActive('/ventas') ? 'active' : ''}`}
                    >
                        📋 Ventas
                    </Link>

                    {isAdmin() && (
                        <>
                            <Link
                                to="/productos"
                                className={`nav-item ${isActive('/productos') ? 'active' : ''}`}
                            >
                                📦 Productos
                            </Link>

                            <Link
                                to="/usuarios"
                                className={`nav-item ${isActive('/usuarios') ? 'active' : ''}`}
                            >
                                👥 Usuarios
                            </Link>
                        </>
                    )}
                </nav>

                <div className="sidebar-footer">
                    <button
                        onClick={toggleTheme}
                        className="btn btn-secondary"
                        style={{ width: '100%', marginBottom: '10px' }}
                    >
                        {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
                    </button>
                    <button
                        onClick={logout}
                        className="btn btn-danger"
                        style={{ width: '100%' }}
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>
        </div>
    );
};

export default Layout;
