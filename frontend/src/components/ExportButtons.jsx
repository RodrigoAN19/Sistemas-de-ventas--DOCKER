/**
 * Componente ExportButtons
 * Botones para exportar datos a PDF y Excel
 */

import { useState } from 'react';
import axios from '../api/axios';
import './ExportButtons.css';

function ExportButtons({ tipo = 'ventas', fecha = null }) {
    const [loading, setLoading] = useState(false);

    const handleExport = async (formato) => {
        setLoading(true);
        try {
            let url = '';
            let filename = '';

            // Determinar URL según tipo y formato
            if (tipo === 'ventas') {
                url = `/exportar/ventas/${formato}`;
                filename = `ventas_${new Date().toISOString().split('T')[0]}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;

                // Agregar fecha si existe
                if (fecha) {
                    url += `?fecha=${fecha}`;
                    filename = `ventas_${fecha}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
                }
            } else if (tipo === 'productos') {
                url = `/exportar/productos/${formato}`;
                filename = `productos_${new Date().toISOString().split('T')[0]}.${formato === 'pdf' ? 'pdf' : 'xlsx'}`;
            } else if (tipo === 'dashboard') {
                url = `/exportar/dashboard/pdf`;
                filename = `dashboard_${new Date().toISOString().split('T')[0]}.pdf`;
            }

            // Realizar petición con responseType blob
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const fullUrl = `${API_URL}/api${url}`;

            const response = await fetch(fullUrl, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Accept': formato === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
            });

            if (!response.ok) {
                throw new Error('Error al exportar');
            }

            // Convertir a blob
            const blob = await response.blob();

            // Crear link de descarga
            const link = document.createElement('a');
            link.href = window.URL.createObjectURL(blob);
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            // Limpiar
            window.URL.revokeObjectURL(link.href);

            console.log(`✅ Archivo ${filename} descargado`);

        } catch (error) {
            console.error('Error exportando:', error);
            alert('Error al exportar. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="export-buttons">
            <button
                onClick={() => handleExport('pdf')}
                disabled={loading}
                className="export-btn pdf-btn"
                title="Exportar a PDF"
            >
                {loading ? (
                    <span className="loading-spinner"></span>
                ) : (
                    <>
                        <span className="btn-icon">📄</span>
                        <span className="btn-text">Exportar PDF</span>
                    </>
                )}
            </button>

            {tipo !== 'dashboard' && (
                <button
                    onClick={() => handleExport('excel')}
                    disabled={loading}
                    className="export-btn excel-btn"
                    title="Exportar a Excel"
                >
                    {loading ? (
                        <span className="loading-spinner"></span>
                    ) : (
                        <>
                            <span className="btn-icon">📊</span>
                            <span className="btn-text">Exportar Excel</span>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

export default ExportButtons;
