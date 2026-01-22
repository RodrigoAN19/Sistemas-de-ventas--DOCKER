/**
 * Utilidad para generar archivos PDF
 * Librería: PDFKit
 */

const PDFDocument = require('pdfkit');

/**
 * Genera un PDF con el listado de ventas
 * @param {Array} ventas - Array de ventas
 * @param {Object} resumen - Resumen de ventas (opcional)
 * @returns {PDFDocument} - Stream del PDF
 */
function generarPDFVentas(ventas, resumen = null) {
    const doc = new PDFDocument({ margin: 50 });

    // Encabezado
    doc
        .fontSize(20)
        .text('LICORERÍA CUEVA', { align: 'center' })
        .fontSize(14)
        .text('Reporte de Ventas', { align: 'center' })
        .fontSize(10)
        .text(`Fecha de generación: ${new Date().toLocaleDateString('es-PE')}`, { align: 'center' })
        .moveDown(2);

    // Resumen si existe
    if (resumen) {
        doc
            .fontSize(12)
            .text('RESUMEN', { underline: true })
            .fontSize(10)
            .text(`Total de ventas: ${resumen.total_ventas || ventas.length}`)
            .text(`Monto total: S/ ${Number(resumen.monto_total || 0).toFixed(2)}`)
            .text(`Promedio por venta: S/ ${Number(resumen.promedio || 0).toFixed(2)}`)
            .moveDown(1.5);
    }

    // Tabla de ventas
    doc.fontSize(12).text('DETALLE DE VENTAS', { underline: true }).moveDown(0.5);

    // Encabezados de tabla
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 150;
    const col3 = 280;
    const col4 = 380;
    const col5 = 480;

    doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Código', col1, tableTop)
        .text('Fecha', col2, tableTop)
        .text('Vendedor', col3, tableTop)
        .text('Total', col4, tableTop)
        .font('Helvetica');

    doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Filas de datos
    let y = tableTop + 25;
    ventas.forEach((venta, index) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        const fecha = new Date(venta.fecha).toLocaleDateString('es-PE');

        doc
            .fontSize(8)
            .text(venta.codigo_venta, col1, y, { width: 90 })
            .text(fecha, col2, y, { width: 120 })
            .text(venta.vendedor || venta.nombre, col3, y, { width: 90 })
            .text(`S/ ${Number(venta.total).toFixed(2)}`, col4, y, { width: 90 });

        y += 20;
    });

    // Pie de página
    doc
        .moveDown(2)
        .fontSize(8)
        .text('Licorería Cueva - Sistema de Ventas', { align: 'center' });

    doc.end();
    return doc;
}

/**
 * Genera un PDF con el listado de productos
 * @param {Array} productos - Array de productos
 * @returns {PDFDocument} - Stream del PDF
 */
function generarPDFProductos(productos) {
    const doc = new PDFDocument({ margin: 50 });

    // Encabezado
    doc
        .fontSize(20)
        .text('LICORERÍA CUEVA', { align: 'center' })
        .fontSize(14)
        .text('Inventario de Productos', { align: 'center' })
        .fontSize(10)
        .text(`Fecha de generación: ${new Date().toLocaleDateString('es-PE')}`, { align: 'center' })
        .moveDown(2);

    // Resumen
    const totalProductos = productos.length;
    const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

    doc
        .fontSize(12)
        .text('RESUMEN', { underline: true })
        .fontSize(10)
        .text(`Total de productos: ${totalProductos}`)
        .text(`Valor total del inventario: S/ ${valorTotal.toFixed(2)}`)
        .moveDown(1.5);

    // Tabla de productos
    doc.fontSize(12).text('DETALLE DE PRODUCTOS', { underline: true }).moveDown(0.5);

    // Encabezados
    const tableTop = doc.y;
    const col1 = 50;
    const col2 = 200;
    const col3 = 350;
    const col4 = 430;
    const col5 = 500;

    doc
        .fontSize(9)
        .font('Helvetica-Bold')
        .text('Nombre', col1, tableTop)
        .text('Código Barras', col2, tableTop)
        .text('Precio', col3, tableTop)
        .text('Stock', col4, tableTop)
        .text('Estado', col5, tableTop)
        .font('Helvetica');

    doc.moveTo(col1, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    // Filas
    let y = tableTop + 25;
    productos.forEach((producto) => {
        if (y > 700) {
            doc.addPage();
            y = 50;
        }

        doc
            .fontSize(8)
            .text(producto.nombre, col1, y, { width: 140 })
            .text(producto.codigo_barra || 'N/A', col2, y, { width: 140 })
            .text(`S/ ${Number(producto.precio).toFixed(2)}`, col3, y, { width: 70 })
            .text(producto.stock, col4, y, { width: 60 })
            .text(producto.estado, col5, y, { width: 50 });

        y += 20;
    });

    // Pie de página
    doc
        .moveDown(2)
        .fontSize(8)
        .text('Licorería Cueva - Sistema de Ventas', { align: 'center' });

    doc.end();
    return doc;
}

/**
 * Genera un PDF del dashboard con estadísticas
 * @param {Object} stats - Estadísticas del dashboard
 * @returns {PDFDocument} - Stream del PDF
 */
function generarPDFDashboard(stats) {
    const doc = new PDFDocument({ margin: 50 });

    // Encabezado
    doc
        .fontSize(20)
        .text('LICORERÍA CUEVA', { align: 'center' })
        .fontSize(14)
        .text('Dashboard - Estadísticas', { align: 'center' })
        .fontSize(10)
        .text(`Fecha de generación: ${new Date().toLocaleDateString('es-PE')}`, { align: 'center' })
        .moveDown(2);

    // Estadísticas generales
    doc
        .fontSize(14)
        .text('ESTADÍSTICAS GENERALES', { underline: true })
        .moveDown(0.5)
        .fontSize(11)
        .text(`Total de ventas: ${stats.total_ventas || 0}`)
        .text(`Ventas del día: ${stats.ventas_dia || 0}`)
        .text(`Monto total: S/ ${Number(stats.monto_total || 0).toFixed(2)}`)
        .text(`Promedio por venta: S/ ${Number(stats.promedio_venta || 0).toFixed(2)}`)
        .moveDown(2);

    // Productos más vendidos
    if (stats.productos_mas_vendidos && stats.productos_mas_vendidos.length > 0) {
        doc
            .fontSize(14)
            .text('PRODUCTOS MÁS VENDIDOS', { underline: true })
            .moveDown(0.5);

        stats.productos_mas_vendidos.forEach((producto, index) => {
            doc
                .fontSize(10)
                .text(`${index + 1}. ${producto.nombre} - ${producto.total_vendido} unidades`);
        });
    }

    // Pie de página
    doc
        .moveDown(3)
        .fontSize(8)
        .text('Licorería Cueva - Sistema de Ventas', { align: 'center' });

    doc.end();
    return doc;
}

module.exports = {
    generarPDFVentas,
    generarPDFProductos,
    generarPDFDashboard
};
