let newWorkbook = null;

// Funciones del Modal de Exportación
function exportFilteredData() {
    const modal = document.getElementById('exportModal');
    modal.classList.add('show');
}

function closeExportModal() {
    const modal = document.getElementById('exportModal');
    modal.classList.remove('show');
}

function toggleExportOptions() {
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    const excelOptions = document.getElementById('excelOptions');
    if (format === 'excel') {
        excelOptions.style.display = 'block';
    } else {
        excelOptions.style.display = 'none';
    }
}

function confirmExport() {
    const dataToExport = filteredData.length > 0 ? filteredData : processedData;
    const format = document.querySelector('input[name="exportFormat"]:checked').value;
    const timestamp = new Date().toISOString().split('T')[0];

    if (format === 'excel') {
        const sheets = {
            datos: document.getElementById('checkDatos').checked,
            resumen: document.getElementById('checkResumen').checked,
            evaluaciones: document.getElementById('checkEvaluaciones').checked
        };
        exportToExcel(dataToExport, `datos_filtrados_${timestamp}.xlsx`, sheets);
    } else if (format === 'csv') {
        exportToCSV(dataToExport, `datos_filtrados_${timestamp}.csv`);
    } else if (format === 'json') {
        exportToJSON(dataToExport, `datos_filtrados_${timestamp}.json`);
    }

    closeExportModal();
}

function exportToCSV(data, filename) {
    const headers = ['N° Entrega', 'Fecha', 'Banco', 'Fase', 'Mallas', 'Puntaje FC', 'Cumple FC', 'Metros'];
    let csv = headers.join(',') + '\n';

    data.forEach(row => {
        csv += [
            row.numeroEntrega,
            row.fecha,
            row.banco,
            row.fase,
            `"${row.mallasAsociadas}"`,
            row.puntajeTotal,
            row.cumpleFactorCondicion,
            row.metrosEvaluados
        ].join(',') + '\n';
    });

    downloadFile(csv, filename, 'text/csv');
}

function exportToJSON(data, filename) {
    const json = JSON.stringify(data, null, 2);
    downloadFile(json, filename, 'application/json');
}

function exportToExcel(data, filename, sheets = { datos: true }) {
    const wb = XLSX.utils.book_new();

    // 1. Hoja Datos Consolidados (Siempre o si se selecciona)
    if (sheets.datos) {
        const datosVisible = data.map(row => ({
            'N° Entrega': row.numeroEntrega,
            'Fecha': row.fecha,
            'Banco': row.banco,
            'Fase': row.fase,
            'Mallas': row.mallasAsociadas,
            'Puntaje FC': row.puntajeTotal,
            'Cumple FC': row.cumpleFactorCondicion,
            'Metros': row.metrosEvaluados
        }));
        const wsDatos = XLSX.utils.json_to_sheet(datosVisible);
        XLSX.utils.book_append_sheet(wb, wsDatos, 'Datos');
        // Ajustar ancho de columnas básico
        wsDatos['!cols'] = [{ wch: 10 }, { wch: 12 }, { wch: 8 }, { wch: 8 }, { wch: 25 }, { wch: 10 }, { wch: 10 }, { wch: 10 }];
    }

    // 2. Hoja Resumen
    if (sheets.resumen) {
        const summaryData = [];
        // Por Fase
        const byFase = _.groupBy(data, 'fase');
        Object.keys(byFase).sort().forEach(fase => {
            const items = byFase[fase];
            summaryData.push({
                'Tipo': 'Por Fase',
                'Categoría': fase,
                'Total Entregas': items.length,
                'Promedio Puntaje': _.mean(items.map(d => parseFloat(d.puntajeTotal) || 0)).toFixed(2),
                'Total Metros': _.sum(items.map(d => parseFloat(d.metrosEvaluados) || 0)).toFixed(2),
                'Cumplimiento (%)': ((items.filter(d => d.cumpleFactorCondicion === 'Si').length / items.length) * 100).toFixed(1)
            });
        });
        // Por Banco
        const byBanco = _.groupBy(data, 'banco');
        Object.keys(byBanco).sort().forEach(banco => {
            const items = byBanco[banco];
            summaryData.push({
                'Tipo': 'Por Banco',
                'Categoría': banco,
                'Total Entregas': items.length,
                'Promedio Puntaje': _.mean(items.map(d => parseFloat(d.puntajeTotal) || 0)).toFixed(2),
                'Total Metros': _.sum(items.map(d => parseFloat(d.metrosEvaluados) || 0)).toFixed(2),
                'Cumplimiento (%)': ((items.filter(d => d.cumpleFactorCondicion === 'Si').length / items.length) * 100).toFixed(1)
            });
        });
        const wsResumen = XLSX.utils.json_to_sheet(summaryData);
        XLSX.utils.book_append_sheet(wb, wsResumen, 'Resumen');
        wsResumen['!cols'] = [{ wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
    }

    // 3. Hoja Evaluaciones
    if (sheets.evaluaciones) {
        const evaluacionesData = data.map(row => ({
            'N° Entrega': row.numeroEntrega,
            'Bloques Inestables': `${row.bloquesInestables_eval} (${row.bloquesInestables_puntaje})`,
            'Discontinuidades': `${row.discontinuidades_eval} (${row.discontinuidades_puntaje})`,
            'Cresta Talud': `${row.crestaDelTalud_eval} (${row.crestaDelTalud_puntaje})`,
            'Geometría': `${row.geometriaPerfil_eval} (${row.geometriaPerfil_puntaje})`,
            'Cara Talud': `${row.caraTalud_eval} (${row.caraTalud_puntaje})`,
            'Puntaje Total': row.puntajeTotal,
            'Obs. Geotecnia': row.obsGeotecnia || '-'
        }));
        const wsEval = XLSX.utils.json_to_sheet(evaluacionesData);
        XLSX.utils.book_append_sheet(wb, wsEval, 'Evaluaciones FC');
        wsEval['!cols'] = [{ wch: 10 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 50 }];
    }

    // Descargar
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function downloadFile(content, filename, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
}

function createExcelWorkbook() {
    newWorkbook = XLSX.utils.book_new();

    // Hoja principal
    const mainSheet = XLSX.utils.json_to_sheet(processedData);
    XLSX.utils.book_append_sheet(newWorkbook, mainSheet, 'Datos Consolidados');

    // Hoja de resumen
    const summaryData = [];

    // Por Fase
    const byFase = _.groupBy(processedData, 'fase');
    Object.keys(byFase).forEach(fase => {
        const items = byFase[fase];
        summaryData.push({
            'Tipo': 'Por Fase',
            'Categoría': fase,
            'Total Entregas': items.length,
            'Promedio Puntaje': _.mean(items.map(d => parseFloat(d.puntajeTotal) || 0)).toFixed(2),
            'Total Metros': _.sum(items.map(d => parseFloat(d.metrosEvaluados) || 0)).toFixed(2),
            'Cumplimiento (%)': ((items.filter(d => d.cumpleFactorCondicion === 'Si').length / items.length) * 100).toFixed(1)
        });
    });

    // Por Banco
    const byBanco = _.groupBy(processedData, 'banco');
    Object.keys(byBanco).forEach(banco => {
        const items = byBanco[banco];
        summaryData.push({
            'Tipo': 'Por Banco',
            'Categoría': banco,
            'Total Entregas': items.length,
            'Promedio Puntaje': _.mean(items.map(d => parseFloat(d.puntajeTotal) || 0)).toFixed(2),
            'Total Metros': _.sum(items.map(d => parseFloat(d.metrosEvaluados) || 0)).toFixed(2),
            'Cumplimiento (%)': ((items.filter(d => d.cumpleFactorCondicion === 'Si').length / items.length) * 100).toFixed(1)
        });
    });

    const summarySheet = XLSX.utils.json_to_sheet(summaryData);
    XLSX.utils.book_append_sheet(newWorkbook, summarySheet, 'Resumen');
}

function downloadExcel() {
    if (!newWorkbook) return;

    const wbout = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'binary' });
    const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ENTREGA_BANCO_CONSOLIDADO_2025.xlsx';
    a.click();
}
