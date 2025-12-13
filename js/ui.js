let currentSummaryType = 'fase';
let sortConfig = {
    datos: { column: null, direction: 'asc' },
    resumen: { column: null, direction: 'asc' },
    evaluaciones: { column: null, direction: 'asc' }
};

// Variables globales para filtros
let filteredData = [];

function updateStats(data = processedData) {
    const total = data.length;
    const totalMetros = data.reduce((sum, d) => sum + (parseFloat(d.metrosEvaluados) || 0), 0);
    const promedioPuntaje = data.reduce((sum, d) => sum + (parseFloat(d.puntajeTotal) || 0), 0) / (total || 1);
    const cumplimiento = total > 0 ? (data.filter(d => d.cumpleFactorCondicion === 'Si').length / total * 100) : 0;

    document.getElementById('totalEntregas').textContent = total;
    document.getElementById('totalMetros').textContent = totalMetros.toFixed(1) + 'm';
    document.getElementById('promedioPuntaje').textContent = promedioPuntaje.toFixed(1);
    document.getElementById('cumplimiento').textContent = cumplimiento.toFixed(1) + '%';
}

function createTables() {
    // Tabla de datos consolidados
    createDataTable();

    // Tabla de resumen (por defecto muestra por fase)
    createSummaryTable('fase');

    // Actualizar subtítulo inicial
    const faseCount = Object.keys(_.groupBy(processedData, 'fase')).length;
    const summarySubtitle = document.getElementById('summarySubtitle');
    if (summarySubtitle) {
        summarySubtitle.textContent = `Mostrando agrupación por Fase (${faseCount} fases diferentes)`;
    }

    // Tabla de evaluaciones
    createEvaluationsTable();
}

function createDataTable() {
    filteredData = processedData;
    updateDataTable(processedData);
    initializeFilters();
}

function updateDataTable(data) {
    const table = document.getElementById('datosTable');
    const headers = [
        { name: 'N° Entrega', type: 'number' },
        { name: 'Fecha', type: 'date' },
        { name: 'Banco', type: 'number' },
        { name: 'Fase', type: 'string' },
        { name: 'Mallas', type: 'string' },
        { name: 'Puntaje FC', type: 'number' },
        { name: 'Cumple FC', type: 'string' },
        { name: 'Metros', type: 'number' },
        { name: 'Fotos', type: 'string' }
    ];

    let html = '<thead><tr>';
    headers.forEach((h, index) => {
        if (h.name === 'Fotos') {
            html += `<th>${h.name}</th>`;
        } else {
            html += `<th class="sortable" onclick="sortTable('datosTable', ${index}, '${h.type}')">${h.name}</th>`;
        }
    });
    html += '</tr></thead><tbody>';

    data.forEach(row => {
        const hasImages = row.images && row.images.length > 0;

        html += '<tr>';
        html += `<td>${row.numeroEntrega}</td>`;
        html += `<td>${row.fecha}</td>`;
        html += `<td>${row.banco}</td>`;
        html += `<td>${row.fase}</td>`;
        html += `<td>${row.mallasAsociadas}</td>`;
        html += `<td>${row.puntajeTotal}</td>`;
        html += `<td>${row.cumpleFactorCondicion === 'Si' ? '<span class="success-badge">Si</span>' : '<span class="warning-badge">No</span>'}</td>`;
        html += `<td>${row.metrosEvaluados}</td>`;
        // Columna Fotos
        html += `<td>`;
        if (hasImages) {
            html += `<button class="btn btn-sm btn-outline" style="padding: 0.25rem 0.5rem; font-size: 0.8rem;" onclick="showImages(${row._id})">
            📷 ${row.images.length}
        </button>`;
        } else {
            html += `<span style="color: #9ca3af;">-</span>`;
        }
        html += `</td>`;
        html += '</tr>';
    });

    html += '</tbody>';
    table.innerHTML = html;
}

function sortTable(tableId, columnIndex, dataType = 'string') {
    const table = document.getElementById(tableId);
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    const headers = table.querySelectorAll('th');

    // Determinar dirección del ordenamiento
    let direction = 'asc';
    const configKey = tableId.replace('Table', '');

    if (sortConfig[configKey]) {
        if (sortConfig[configKey].column === columnIndex) {
            direction = sortConfig[configKey].direction === 'asc' ? 'desc' : 'asc';
        }
        sortConfig[configKey] = { column: columnIndex, direction: direction };
    }

    // Limpiar clases de ordenamiento
    headers.forEach(header => {
        header.classList.remove('sorted-asc', 'sorted-desc');
    });

    // Agregar clase al header actual
    headers[columnIndex].classList.add(direction === 'asc' ? 'sorted-asc' : 'sorted-desc');

    // Animación de ordenamiento
    tbody.style.transition = 'opacity 0.3s';
    tbody.style.opacity = '0.5';

    // Ordenar filas
    rows.sort((a, b) => {
        let aValue = a.cells[columnIndex].textContent.trim();
        let bValue = b.cells[columnIndex].textContent.trim();

        // Manejar badges especiales
        const aSpan = a.cells[columnIndex].querySelector('span');
        const bSpan = b.cells[columnIndex].querySelector('span');
        if (aSpan) aValue = aSpan.textContent;
        if (bSpan) bValue = bSpan.textContent;

        // Remover símbolos para comparación numérica
        if (dataType === 'number') {
            aValue = parseFloat(aValue.replace(/[^0-9.-]/g, '')) || 0;
            bValue = parseFloat(bValue.replace(/[^0-9.-]/g, '')) || 0;
        } else if (dataType === 'date') {
            // Manejar diferentes formatos de fecha
            if (aValue.includes('-')) {
                const [d, m, y] = aValue.split('-');
                aValue = new Date(`${y}-${m}-${d}`);
            } else {
                aValue = new Date(aValue);
            }
            if (bValue.includes('-')) {
                const [d, m, y] = bValue.split('-');
                bValue = new Date(`${y}-${m}-${d}`);
            } else {
                bValue = new Date(bValue);
            }
        }

        if (dataType === 'number' || dataType === 'date') {
            return direction === 'asc' ? aValue - bValue : bValue - aValue;
        } else {
            // Comparación de strings
            if (aValue < bValue) return direction === 'asc' ? -1 : 1;
            if (aValue > bValue) return direction === 'asc' ? 1 : -1;
            return 0;
        }
    });

    // Reordenar DOM con animación
    setTimeout(() => {
        rows.forEach((row, index) => {
            tbody.appendChild(row);
            // Destacar las primeras 3 filas brevemente
            if (index < 3) {
                row.classList.add('highlight');
                setTimeout(() => row.classList.remove('highlight'), 1000);
            }
        });

        tbody.style.opacity = '1';

        // Agregar clase a columna ordenada
        rows.forEach(row => {
            Array.from(row.cells).forEach((cell, idx) => {
                if (idx === columnIndex) {
                    cell.classList.add('sorted-column');
                } else {
                    cell.classList.remove('sorted-column');
                }
            });
        });
    }, 100);
}

function createSummaryTable(type = 'fase', data = processedData) {
    const table = document.getElementById('resumenTable');
    const categoryName = type === 'fase' ? 'Fase' : 'Banco';

    const headers = [
        { name: categoryName, type: 'string' },
        { name: 'Total Entregas', type: 'number' },
        { name: 'Promedio Puntaje', type: 'number' },
        { name: 'Total Metros', type: 'number' },
        { name: 'Cumplimiento', type: 'number' }
    ];

    let html = '<thead><tr>';
    headers.forEach((h, index) => {
        html += `<th class="sortable" onclick="sortTable('resumenTable', ${index}, '${h.type}')">${h.name}</th>`;
    });
    html += '</tr></thead><tbody>';

    let groupCount = 0;

    if (type === 'fase') {
        // Por Fase
        const byFase = _.groupBy(data, 'fase');
        const fases = Object.keys(byFase).sort();
        groupCount = fases.length;

        fases.forEach(fase => {
            const items = byFase[fase];
            const avgScore = _.mean(items.map(d => parseFloat(d.puntajeTotal) || 0));
            const totalMeters = _.sum(items.map(d => parseFloat(d.metrosEvaluados) || 0));
            const compliance = (items.filter(d => d.cumpleFactorCondicion === 'Si').length / items.length * 100);

            html += '<tr>';
            html += `<td><strong>${fase || 'Sin definir'}</strong></td>`;
            html += `<td>${items.length}</td>`;
            html += `<td>${avgScore.toFixed(2)}</td>`;
            html += `<td>${totalMeters.toFixed(2)}m</td>`;
            html += `<td>${compliance >= 70 ? '<span class="success-badge">' : '<span class="warning-badge">'}${compliance.toFixed(1)}%</span></td>`;
            html += '</tr>';
        });
    } else {
        // Por Banco
        const byBanco = _.groupBy(data, 'banco');
        const bancos = Object.keys(byBanco).sort();
        groupCount = bancos.length;

        bancos.forEach(banco => {
            const items = byBanco[banco];
            const avgScore = _.mean(items.map(d => parseFloat(d.puntajeTotal) || 0));
            const totalMeters = _.sum(items.map(d => parseFloat(d.metrosEvaluados) || 0));
            const compliance = (items.filter(d => d.cumpleFactorCondicion === 'Si').length / items.length * 100);

            html += '<tr>';
            html += `<td><strong>${banco || 'Sin definir'}</strong></td>`;
            html += `<td>${items.length}</td>`;
            html += `<td>${avgScore.toFixed(2)}</td>`;
            html += `<td>${totalMeters.toFixed(2)}m</td>`;
            html += `<td>${compliance >= 70 ? '<span class="success-badge">' : '<span class="warning-badge">'}${compliance.toFixed(1)}%</span></td>`;
            html += '</tr>';
        });
    }

    // Agregar fila de totales
    const totalEntregas = data.length;
    const avgTotalScore = _.mean(data.map(d => parseFloat(d.puntajeTotal) || 0));
    const totalAllMeters = _.sum(data.map(d => parseFloat(d.metrosEvaluados) || 0));
    const totalCompliance = totalEntregas > 0 ? (data.filter(d => d.cumpleFactorCondicion === 'Si').length / totalEntregas * 100) : 0;

    html += '<tr style="border-top: 2px solid #667eea; background-color: #f3f4f6;">';
    html += `<td><strong>TOTAL (${groupCount} ${type === 'fase' ? 'fases' : 'bancos'})</strong></td>`;
    html += `<td><strong>${totalEntregas}</strong></td>`;
    // Check NaN for empty data
    html += `<td><strong>${isNaN(avgTotalScore) ? '0.00' : avgTotalScore.toFixed(2)}</strong></td>`;
    html += `<td><strong>${totalAllMeters.toFixed(2)}m</strong></td>`;
    html += `<td><strong>${totalCompliance >= 70 ? '<span class="success-badge">' : '<span class="warning-badge">'}${totalCompliance.toFixed(1)}%</span></strong></td>`;
    html += '</tr>';

    html += '</tbody>';
    table.innerHTML = html;
}

function showSummaryType(type) {
    if (!processedData || processedData.length === 0) return;

    currentSummaryType = type;

    // Actualizar botones activos
    document.getElementById('btnFase').classList.remove('active');
    document.getElementById('btnBanco').classList.remove('active');

    // Actualizar subtítulo
    const subtitle = document.getElementById('summarySubtitle');
    const table = document.getElementById('resumenTable');

    // Agregar efecto de desvanecimiento
    table.style.opacity = '0.5';
    table.style.transition = 'opacity 0.2s';

    setTimeout(() => {
        if (type === 'fase') {
            document.getElementById('btnFase').classList.add('active');
            const faseCount = Object.keys(_.groupBy(processedData, 'fase')).length;
            subtitle.textContent = `Mostrando agrupación por Fase (${faseCount} fases diferentes)`;
        } else {
            document.getElementById('btnBanco').classList.add('active');
            const bancoCount = Object.keys(_.groupBy(processedData, 'banco')).length;
            subtitle.textContent = `Mostrando agrupación por Banco (${bancoCount} bancos diferentes)`;
        }

        // Recrear la tabla con el tipo seleccionado
        createSummaryTable(type, filteredData); // Usar filteredData para consistencia

        // Restaurar opacidad
        setTimeout(() => {
            table.style.opacity = '1';
        }, 50);
    }, 200);
}

function createEvaluationsTable(data = processedData) {
    const table = document.getElementById('evaluacionesTable');
    const headers = [
        { name: 'N° Entrega', type: 'number' },
        { name: 'Bloques Inestables', type: 'string' },
        { name: 'Discontinuidades', type: 'string' },
        { name: 'Cresta Talud', type: 'string' },
        { name: 'Geometría', type: 'string' },
        { name: 'Cara Talud', type: 'string' },
        { name: 'Puntaje Total', type: 'number' },
        { name: 'Obs. Geotecnia', type: 'string' }
    ];

    let html = '<thead><tr>';
    headers.forEach((h, index) => {
        html += `<th class="sortable" onclick="sortTable('evaluacionesTable', ${index}, '${h.type}')">${h.name}</th>`;
    });
    html += '</tr></thead><tbody>';

    data.forEach(row => {
        html += '<tr>';
        html += `<td>${row.numeroEntrega}</td>`;
        html += `<td>${row.bloquesInestables_eval} (${row.bloquesInestables_puntaje})</td>`;
        html += `<td>${row.discontinuidades_eval} (${row.discontinuidades_puntaje})</td>`;
        html += `<td>${row.crestaDelTalud_eval} (${row.crestaDelTalud_puntaje})</td>`;
        html += `<td>${row.geometriaPerfil_eval} (${row.geometriaPerfil_puntaje})</td>`;
        html += `<td>${row.caraTalud_eval} (${row.caraTalud_puntaje})</td>`;
        html += `<td><strong>${row.puntajeTotal}</strong></td>`;
        html += `<td>${row.obsGeotecnia || '-'}</td>`;
        html += '</tr>';
    });

    html += '</tbody>';
    table.innerHTML = html;
}

// Funciones de Galería
function showImages(id) {
    console.log('--- showImages INICIO --- ID:', id);
    try {
        const modal = document.getElementById('galleryModal');
        const grid = document.getElementById('galleryGrid');
        const title = document.getElementById('galleryTitle');

        if (!modal || !grid || !title) {
            console.error('Elementos del DOM no encontrados');
            return;
        }

        // Limpiar grid previo
        grid.innerHTML = '<div style="text-align:center; width:100%; padding:20px;">Cargando imágenes...</div>';

        // FORZAR VISIBILIDAD (Corregido z-index para permitir preview encima)
        modal.style.cssText = 'display: flex !important; opacity: 1 !important; visibility: visible !important; position: fixed !important; top: 0; left: 0; width: 100%; height: 100%;';
        modal.classList.add('show');

        const numericId = Number(id);
        if (isNaN(numericId)) {
            grid.innerHTML = '<div style="color:red; text-align:center;">Error: ID de imagen inválido</div>';
            return;
        }

        // Buscar datos con seguridad
        let rowData = null;
        if (processedData && Array.isArray(processedData)) {
            rowData = processedData.find(d => d._id === numericId);
        }

        if (!rowData) {
            console.error('Datos no encontrados para ID:', numericId);
            grid.innerHTML = '<div style="color:red; text-align:center;">No se encontraron los datos de esta entrega.</div>';
            return;
        }

        title.textContent = `Imágenes - Entrega N°${rowData.numeroEntrega} (${rowData.banco})`;

        if (!rowData.images || !Array.isArray(rowData.images) || rowData.images.length === 0) {
            grid.innerHTML = '<div style="text-align:center; padding:20px;">No hay imágenes disponibles para esta entrega.</div>';
            return;
        }

        // Renderizar imágenes
        grid.innerHTML = '';
        rowData.images.forEach((img, index) => {
            try {
                const item = document.createElement('div');
                item.className = 'gallery-item';
                // Usar un placeholder si src falla, o manejar error de carga
                item.innerHTML = `<img src="${img.src}" alt="Imagen ${index + 1}" loading="lazy" onerror="this.src='https://via.placeholder.com/150?text=Error+Img'">`;
                item.onclick = function () { openImagePreview(img.src); };
                grid.appendChild(item);
            } catch (errRender) {
                console.error('Error renderizando imagen:', errRender);
            }
        });

    } catch (e) {
        console.error('CRASH en showImages:', e);
        alert('Error inesperado al abrir la galería: ' + e.message);
    }
}

function closeGalleryModal() {
    const modal = document.getElementById('galleryModal');
    modal.classList.remove('show');
    modal.style.cssText = ''; // Limpiar estilos forzados
}

function openImagePreview(src) {
    const overlay = document.getElementById('imagePreview');
    const img = document.getElementById('previewImg');
    img.src = src;
    overlay.classList.add('show');
}

function closeImagePreview() {
    document.getElementById('imagePreview').classList.remove('show');
}

function showTab(tabName) {
    // Ocultar todos los tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Quitar active de todos los botones
    document.querySelectorAll('.tab').forEach(btn => {
        btn.classList.remove('active');
    });

    // Mostrar el tab seleccionado
    document.getElementById(tabName + 'Tab').classList.add('active');

    // Activar el botón correspondiente
    event.target.classList.add('active');
}

function initializeFilters() {
    if (!processedData || processedData.length === 0) return;

    // Llenar select de Fases
    const fases = [...new Set(processedData.map(d => d.fase))].sort();
    const filterFase = document.getElementById('filterFase');
    if (filterFase) {
        filterFase.innerHTML = '<option value="">Todas</option>';
        fases.forEach(fase => {
            filterFase.innerHTML += `<option value="${fase}">Fase ${fase}</option>`;
        });
    }

    // Llenar select de Bancos
    const bancos = [...new Set(processedData.map(d => d.banco))].sort();
    const filterBanco = document.getElementById('filterBanco');
    if (filterBanco) {
        filterBanco.innerHTML = '<option value="">Todos</option>';
        bancos.forEach(banco => {
            filterBanco.innerHTML += `<option value="${banco}">Banco ${banco}</option>`;
        });
    }

    // Inicializar contador
    updateDataCounter(processedData.length, processedData.length);
}

function filterData() {
    if (!processedData || processedData.length === 0) return;

    // Mostrar indicador de carga
    const table = document.getElementById('datosTable');
    const originalContent = table.innerHTML;
    table.innerHTML = '<tbody><tr><td colspan="8" style="text-align: center; padding: 20px;">⏳ Aplicando filtros...</td></tr></tbody>';

    setTimeout(() => {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const filterFase = document.getElementById('filterFase').value;
        const filterBanco = document.getElementById('filterBanco').value;
        const filterCumple = document.getElementById('filterCumple').value;
        const filterPuntaje = parseFloat(document.getElementById('filterPuntaje').value) || 0;

        filteredData = processedData.filter(row => {
            // Búsqueda general
            if (searchTerm) {
                const searchableText = Object.values(row).join(' ').toLowerCase();
                if (!searchableText.includes(searchTerm)) return false;
            }

            // Filtros específicos
            if (filterFase && row.fase !== filterFase) return false;
            if (filterBanco && row.banco !== filterBanco) return false;
            if (filterCumple && row.cumpleFactorCondicion !== filterCumple) return false;
            if (filterPuntaje > 0 && parseFloat(row.puntajeTotal) < filterPuntaje) return false;

            return true;
        });

        // Actualizar todas las visualizaciones con datos filtrados
        updateStats(filteredData);
        updateDataTable(filteredData);
        createSummaryTable(currentSummaryType, filteredData); // Usar type actual
        createEvaluationsTable(filteredData);

        updateDataCounter(filteredData.length, processedData.length);

        // Resaltar si hay pocos resultados
        if (filteredData.length === 0) {
            table.innerHTML = '<tbody><tr><td colspan="8" style="text-align: center; padding: 40px; color: #ef4444;">⚠️ No se encontraron resultados con los filtros aplicados</td></tr></tbody>';
        } else if (filteredData.length < 5) {
            // Resaltar las pocas filas encontradas
            setTimeout(() => {
                const rows = table.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    row.classList.add('highlight');
                    setTimeout(() => row.classList.remove('highlight'), 2000);
                });
            }, 100);
        }
    }, 300);
}

function updateDataCounter(filtered, total) {
    const counter = document.getElementById('dataCounter');
    if (counter) {
        const percentage = ((filtered / total) * 100).toFixed(1);
        counter.innerHTML = `
        📊 Mostrando <strong>${filtered}</strong> de <strong>${total}</strong> registros 
        (${percentage}%)
        ${filtered < total ? ' - <span style="color: #667eea;">Filtros activos</span>' : ''}
    `;
    }
}

function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterFase').value = '';
    document.getElementById('filterBanco').value = '';
    document.getElementById('filterCumple').value = '';
    document.getElementById('filterPuntaje').value = '';

    filteredData = processedData;
    updateDataTable(processedData);
    updateDataCounter(processedData.length, processedData.length);
}
