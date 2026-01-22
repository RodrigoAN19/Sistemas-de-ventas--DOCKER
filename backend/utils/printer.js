/**
 * Utilidad para impresión de tickets en impresora térmica
 * Modelo: 3nStar RPT008 (80mm)
 * Protocolo: ESC/POS
 */

// Intentar cargar las librerías de impresión (opcionales)
let escpos, escposUSB;
let PRINTER_AVAILABLE = false;

try {
    escpos = require('escpos');
    escpos.USB = require('escpos-usb');
    PRINTER_AVAILABLE = true;
    console.log('✅ Librerías de impresión cargadas correctamente');
} catch (error) {
    console.warn('⚠️  Librerías de impresión no disponibles - Modo simulación activado');
    console.warn('   Para habilitar impresión física, instala: npm install escpos escpos-usb');
}

/**
 * Imprime un ticket de venta
 * @param {Object} venta - Datos de la venta
 * @param {string} venta.codigo_venta - Código de la venta
 * @param {string} venta.fecha - Fecha de la venta
 * @param {string} venta.vendedor - Nombre del vendedor
 * @param {number} venta.total - Total de la venta
 * @param {Array} venta.productos - Lista de productos vendidos
 */
async function imprimirTicket(venta) {
    // Si no hay librerías de impresión, modo simulación
    if (!PRINTER_AVAILABLE) {
        console.log('🖨️  TICKET SIMULADO - Impresora no disponible');
        console.log('================================');
        console.log('    LICORERÍA CUEVA');
        console.log('================================');
        console.log(`Fecha: ${new Date(venta.fecha).toLocaleDateString('es-PE')}`);
        console.log(`Hora: ${new Date(venta.fecha).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}`);
        console.log(`Venta: ${venta.codigo_venta}`);
        console.log(`Vendedor: ${venta.vendedor}`);
        console.log('--------------------------------');
        console.log('Producto         Cant  Subtotal');
        venta.productos.forEach(producto => {
            const nombre = producto.nombre.padEnd(16).substring(0, 16);
            const cantidad = String(producto.cantidad).padStart(4);
            const subtotal = `S/ ${Number(producto.subtotal).toFixed(2)}`.padStart(9);
            console.log(`${nombre} ${cantidad} ${subtotal}`);
        });
        console.log('--------------------------------');
        console.log(`TOTAL:           S/ ${Number(venta.total).toFixed(2)}`);
        console.log('================================');
        console.log('  Gracias por su compra');
        console.log('================================');

        return {
            success: true,
            message: 'Ticket generado (modo simulación - impresora no disponible)',
            simulated: true
        };
    }

    try {
        // Buscar la impresora USB
        const device = new escpos.USB();
        const printer = new escpos.Printer(device);

        await new Promise((resolve, reject) => {
            device.open(function (error) {
                if (error) {
                    reject(error);
                    return;
                }

                const fecha = new Date(venta.fecha);
                const fechaStr = fecha.toLocaleDateString('es-PE');
                const horaStr = fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

                printer
                    .font('a')
                    .align('ct')
                    .style('bu')
                    .size(1, 1)
                    .text('LICORERÍA CUEVA')
                    .style('normal')
                    .text('================================')
                    .align('lt')
                    .text(`Fecha: ${fechaStr}`)
                    .text(`Hora: ${horaStr}`)
                    .text(`Venta: ${venta.codigo_venta}`)
                    .text(`Vendedor: ${venta.vendedor}`)
                    .text('--------------------------------')
                    .text('Producto         Cant  Subtotal')
                    .text('--------------------------------');

                // Imprimir cada producto
                venta.productos.forEach(producto => {
                    const nombre = producto.nombre.padEnd(16).substring(0, 16);
                    const cantidad = String(producto.cantidad).padStart(4);
                    const subtotal = `S/ ${Number(producto.subtotal).toFixed(2)}`.padStart(9);
                    printer.text(`${nombre} ${cantidad} ${subtotal}`);
                });

                printer
                    .text('--------------------------------')
                    .style('b')
                    .size(1, 1)
                    .text(`TOTAL:           S/ ${Number(venta.total).toFixed(2)}`)
                    .style('normal')
                    .size(0, 0)
                    .text('================================')
                    .align('ct')
                    .text('Gracias por su compra')
                    .text('================================')
                    .feed(3)
                    .cut()
                    .close(() => {
                        resolve();
                    });
            });
        });

        return { success: true, message: 'Ticket impreso correctamente' };

    } catch (error) {
        console.error('Error al imprimir ticket:', error);

        // Si no hay impresora conectada, devolver éxito simulado
        if (error.message && error.message.includes('No device')) {
            console.warn('⚠️  Impresora no conectada - Modo simulación');
            return {
                success: true,
                message: 'Ticket generado (impresora no disponible)',
                simulated: true
            };
        }

        throw error;
    }
}

/**
 * Verifica si hay una impresora conectada
 */
function verificarImpresora() {
    if (!PRINTER_AVAILABLE) {
        return {
            disponible: false,
            modo: 'simulacion',
            mensaje: 'Librerías de impresión no instaladas. Sistema funcionando en modo simulación.'
        };
    }

    try {
        const device = new escpos.USB();
        return { disponible: true, modelo: '3nStar RPT008' };
    } catch (error) {
        return {
            disponible: false,
            modo: 'simulacion',
            error: error.message
        };
    }
}

module.exports = {
    imprimirTicket,
    verificarImpresora
};
