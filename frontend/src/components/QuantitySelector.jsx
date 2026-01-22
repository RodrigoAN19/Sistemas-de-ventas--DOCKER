/**
 * Componente QuantitySelector
 * Selector de cantidad con botones +/- y input manual
 */

import { useState, useEffect } from 'react';
import './QuantitySelector.css';

function QuantitySelector({ value = 1, onChange, min = 1, max = 999, stock = 999 }) {
    const [cantidad, setCantidad] = useState(value);

    useEffect(() => {
        setCantidad(value);
    }, [value]);

    const handleIncrement = () => {
        const newValue = Math.min(cantidad + 1, Math.min(max, stock));
        setCantidad(newValue);
        onChange(newValue);
    };

    const handleDecrement = () => {
        const newValue = Math.max(cantidad - 1, min);
        setCantidad(newValue);
        onChange(newValue);
    };

    const handleChange = (e) => {
        const value = parseInt(e.target.value) || min;
        const newValue = Math.max(min, Math.min(value, Math.min(max, stock)));
        setCantidad(newValue);
        onChange(newValue);
    };

    return (
        <div className="quantity-selector">
            <button
                type="button"
                className="qty-btn qty-minus"
                onClick={handleDecrement}
                disabled={cantidad <= min}
            >
                −
            </button>
            <input
                type="number"
                className="qty-input"
                value={cantidad}
                onChange={handleChange}
                min={min}
                max={Math.min(max, stock)}
            />
            <button
                type="button"
                className="qty-btn qty-plus"
                onClick={handleIncrement}
                disabled={cantidad >= Math.min(max, stock)}
            >
                +
            </button>
        </div>
    );
}

export default QuantitySelector;
