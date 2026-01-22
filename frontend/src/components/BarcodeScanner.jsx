/**
 * Componente BarcodeScanner
 * Input especializado para lector de códigos de barras
 * Compatible con 3nStar SC050 USB
 */

import { useState, useRef, useEffect } from 'react';
import './BarcodeScanner.css';

function BarcodeScanner({ onScan, placeholder = "Escanee código de barras..." }) {
    const [codigo, setCodigo] = useState('');
    const [scanning, setScanning] = useState(false);
    const inputRef = useRef(null);
    const timeoutRef = useRef(null);

    const handleChange = (e) => {
        const value = e.target.value;
        setCodigo(value);
        setScanning(true);

        // Limpiar timeout anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        // Detectar cuando termina el escaneo (el lector envía Enter)
        // Si no hay más cambios en 100ms, procesamos el código
        timeoutRef.current = setTimeout(() => {
            if (value.trim()) {
                procesarCodigo(value.trim());
            }
            setScanning(false);
        }, 100);
    };

    const handleKeyDown = (e) => {
        // El lector envía Enter al final
        if (e.key === 'Enter' && codigo.trim()) {
            e.preventDefault();
            procesarCodigo(codigo.trim());
        }
    };

    const procesarCodigo = (codigoBarras) => {
        console.log('📦 Código escaneado:', codigoBarras);
        onScan(codigoBarras);
        setCodigo('');
        setScanning(false);
    };

    return (
        <div className="barcode-scanner">
            <div className="scanner-icon">
                {scanning ? (
                    <span className="scanning-animation">📡</span>
                ) : (
                    <span>🔍</span>
                )}
            </div>
            <input
                ref={inputRef}
                type="text"
                className={`scanner-input ${scanning ? 'scanning' : ''}`}
                value={codigo}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                autoComplete="off"
            />
            {scanning && (
                <div className="scanning-indicator">
                    <div className="pulse"></div>
                    Escaneando...
                </div>
            )}
        </div>
    );
}

export default BarcodeScanner;
