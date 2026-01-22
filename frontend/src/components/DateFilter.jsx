/**
 * Componente DateFilter
 * Filtro de fechas con resumen diario
 */

import { useState } from 'react';
import './DateFilter.css';

function DateFilter({ onDateChange, resumen = null }) {
    const [fecha, setFecha] = useState('');

    const handleChange = (e) => {
        const newFecha = e.target.value;
        setFecha(newFecha);
        onDateChange(newFecha);
    };

    const handleClear = () => {
        setFecha('');
        onDateChange('');
    };

    const handleToday = () => {
        const today = new Date().toISOString().split('T')[0];
        setFecha(today);
        onDateChange(today);
    };

    return (
        <div className="date-filter">
            <div className="date-filter-controls">
                <div className="date-input-wrapper">
                    <label htmlFor="fecha-filtro">📅 Filtrar por fecha:</label>
                    <input
                        id="fecha-filtro"
                        type="date"
                        value={fecha}
                        onChange={handleChange}
                        className="date-input"
                    />
                </div>
                <div className="date-actions">
                    <button
                        type="button"
                        onClick={handleToday}
                        className="btn-today"
                    >
                        Hoy
                    </button>
                    {fecha && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="btn-clear"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {resumen && fecha && (
                <div className="date-summary">
                    <div className="summary-card">
                        <div className="summary-icon">📊</div>
                        <div className="summary-content">
                            <h4>Resumen del día</h4>
                            <div className="summary-stats">
                                <div className="stat">
                                    <span className="stat-label">Total de ventas:</span>
                                    <span className="stat-value">{resumen.total_ventas || 0}</span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Monto total:</span>
                                    <span className="stat-value highlight">
                                        S/ {Number(resumen.monto_total || 0).toFixed(2)}
                                    </span>
                                </div>
                                <div className="stat">
                                    <span className="stat-label">Promedio por venta:</span>
                                    <span className="stat-value">
                                        S/ {Number(resumen.promedio_venta || 0).toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DateFilter;
