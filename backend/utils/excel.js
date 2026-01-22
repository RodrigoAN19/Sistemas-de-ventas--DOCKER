/**
 * Utilidad para generar archivos Excel
 * Librería: ExcelJS
 */

const ExcelJS = require('exceljs');

/**
 * Genera un archivo Excel con el listado de ventas
 * @param {Array} ventas - Array de ventas
 * @param {Object} resumen - Resumen de ventas (opcional)
 * @returns {Promise<Buffer>} - Buffer del archivo Excel
 */
async function generarExcelVentas(ventas, resumen = null) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Ventas');

    // Configurar propiedades del documento
    workbook.creator = 'Licorería Cueva';
    workbook.created = new Date();

    // Título
    worksheet.mergeCells('A1:E1');
    worksheet.getCell('A1').value = 'LICORERÍA CUEVA - REPORTE DE VENTAS';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Fecha de generación
    worksheet.mergeCells('A2:E2');
    worksheet.getCell('A2').value = `Fecha de generación: ${new Date().toLocaleDateString('es-PE')}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Resumen si existe
    let startRow = 4;
    if (resumen) {
        worksheet.getCell('A4').value = 'RESUMEN';
        worksheet.getCell('A4').font = { bold: true };
        worksheet.getCell('A5').value = `Total de ventas: ${resumen.total_ventas || ventas.length}`;
        worksheet.getCell('A6').value = `Monto total: S/ ${Number(resumen.monto_total || 0).toFixed(2)}`;
        worksheet.getCell('A7').value = `Promedio por venta: S/ ${Number(resumen.promedio || 0).toFixed(2)}`;
        startRow = 9;
    }

    // Encabezados de la tabla
    worksheet.getRow(startRow).values = ['Código', 'Fecha', 'Hora', 'Vendedor', 'Total'];
    worksheet.getRow(startRow).font = { bold: true };
    worksheet.getRow(startRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    // Datos
    ventas.forEach((venta, index) => {
        const fecha = new Date(venta.fecha);
        const row = worksheet.getRow(startRow + 1 + index);

        row.values = [
            venta.codigo_venta,
            fecha.toLocaleDateString('es-PE'),
            fecha.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
            venta.vendedor || venta.nombre,
            Number(venta.total).toFixed(2)
        ];
    });

    // Formato de columnas
    worksheet.getColumn(1).width = 20; // Código
    worksheet.getColumn(2).width = 15; // Fecha
    worksheet.getColumn(3).width = 10; // Hora
    worksheet.getColumn(4).width = 25; // Vendedor
    worksheet.getColumn(5).width = 15; // Total
    worksheet.getColumn(5).numFmt = '"S/ "#,##0.00';

    // Bordes
    const lastRow = startRow + ventas.length;
    for (let i = startRow; i <= lastRow; i++) {
        for (let j = 1; j <= 5; j++) {
            worksheet.getCell(i, j).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }
    }

    return await workbook.xlsx.writeBuffer();
}

/**
 * Genera un archivo Excel con el listado de productos
 * @param {Array} productos - Array de productos
 * @returns {Promise<Buffer>} - Buffer del archivo Excel
 */
async function generarExcelProductos(productos) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Productos');

    // Configurar propiedades
    workbook.creator = 'Licorería Cueva';
    workbook.created = new Date();

    // Título
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = 'LICORERÍA CUEVA - INVENTARIO DE PRODUCTOS';
    worksheet.getCell('A1').font = { size: 16, bold: true };
    worksheet.getCell('A1').alignment = { horizontal: 'center' };

    // Fecha de generación
    worksheet.mergeCells('A2:F2');
    worksheet.getCell('A2').value = `Fecha de generación: ${new Date().toLocaleDateString('es-PE')}`;
    worksheet.getCell('A2').alignment = { horizontal: 'center' };

    // Resumen
    const totalProductos = productos.length;
    const valorTotal = productos.reduce((sum, p) => sum + (p.precio * p.stock), 0);

    worksheet.getCell('A4').value = 'RESUMEN';
    worksheet.getCell('A4').font = { bold: true };
    worksheet.getCell('A5').value = `Total de productos: ${totalProductos}`;
    worksheet.getCell('A6').value = `Valor total del inventario: S/ ${valorTotal.toFixed(2)}`;

    // Encabezados de la tabla
    const startRow = 8;
    worksheet.getRow(startRow).values = ['ID', 'Nombre', 'Código Barras', 'Precio', 'Stock', 'Estado'];
    worksheet.getRow(startRow).font = { bold: true };
    worksheet.getRow(startRow).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFE0E0E0' }
    };

    // Datos
    productos.forEach((producto, index) => {
        const row = worksheet.getRow(startRow + 1 + index);

        row.values = [
            producto.id_producto,
            producto.nombre,
            producto.codigo_barra || 'N/A',
            Number(producto.precio).toFixed(2),
            producto.stock,
            producto.estado
        ];

        // Color de estado
        if (producto.estado === 'inactivo') {
            row.getCell(6).font = { color: { argb: 'FFFF0000' } };
        }

        // Alerta de stock bajo
        if (producto.stock < 10) {
            row.getCell(5).font = { color: { argb: 'FFFF6600' }, bold: true };
        }
    });

    // Formato de columnas
    worksheet.getColumn(1).width = 8;  // ID
    worksheet.getColumn(2).width = 30; // Nombre
    worksheet.getColumn(3).width = 18; // Código Barras
    worksheet.getColumn(4).width = 12; // Precio
    worksheet.getColumn(5).width = 10; // Stock
    worksheet.getColumn(6).width = 12; // Estado
    worksheet.getColumn(4).numFmt = '"S/ "#,##0.00';

    // Bordes
    const lastRow = startRow + productos.length;
    for (let i = startRow; i <= lastRow; i++) {
        for (let j = 1; j <= 6; j++) {
            worksheet.getCell(i, j).border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
            };
        }
    }

    return await workbook.xlsx.writeBuffer();
}

module.exports = {
    generarExcelVentas,
    generarExcelProductos
};
