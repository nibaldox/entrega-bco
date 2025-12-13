let processedData = [];
let workbook = null;
let excelJsWorkbook = null;

// Helper para convertir buffer a base64
function bufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

async function loadFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async function (e) {
            const buffer = e.target.result;

            // Cargar con SheetJS (Datos)
            const data = new Uint8Array(buffer);
            workbook = XLSX.read(data, {
                type: 'array',
                cellDates: true,
                cellStyles: true
            });

            // Cargar con ExcelJS (Imágenes)
            try {
                const wb = new ExcelJS.Workbook();
                await wb.xlsx.load(buffer);
                excelJsWorkbook = wb;
                console.log('ExcelJS cargado correctamente');
            } catch (error) {
                console.error('Error cargando ExcelJS:', error);
            }

            document.getElementById('processBtn').style.display = 'inline-block';
        };
        reader.readAsArrayBuffer(file);
    }
}

function extractSheetData(sheetName) {
    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    const data = {
        nombreHoja: sheetName,
        numeroEntrega: '',
        fecha: '',
        banco: '',
        fase: '',
        mallasAsociadas: '',
        ingPlanificador: '',
        geotecnico: '',
        jefeTurno: '',
        ingProgramacion: '',
        supervisorPyT: '',
        puntoInicio_X: '',
        puntoInicio_Y: '',
        puntoInicio_Z: '',
        puntoFinal_X: '',
        puntoFinal_Y: '',
        puntoFinal_Z: '',
        cumpleLineaDiseno: '',
        bloquesInestables_eval: '',
        bloquesInestables_puntaje: '',
        discontinuidades_eval: '',
        discontinuidades_puntaje: '',
        crestaDelTalud_eval: '',
        crestaDelTalud_puntaje: '',
        geometriaPerfil_eval: '',
        geometriaPerfil_puntaje: '',
        caraTalud_eval: '',
        caraTalud_puntaje: '',
        puntajeTotal: '',
        cumpleFactorCondicion: '',
        metrosEvaluados: '',
        pretilCumpleLinea: '',
        pretilCumpleAltura: '',
        pcInicio: '',
        pcFinal: '',
        obsGeotecnia: '',
        obsCyT: '',
        obsPCP: '',
        obsGPO: '',
        obsPyT: ''
    };

    // Extraer número de entrega
    if (jsonData[0] && jsonData[0][4]) {
        const match = String(jsonData[0][4]).match(/N°(\d+)/);
        if (match) data.numeroEntrega = match[1];
    }

    // Extraer información básica
    if (jsonData[3]) {
        let fecha = jsonData[3][4] || '';
        if (fecha instanceof Date) {
            data.fecha = fecha.toLocaleDateString('es-CL');
        } else if (typeof fecha === 'string' && fecha.includes('T')) {
            data.fecha = new Date(fecha).toLocaleDateString('es-CL');
        } else {
            data.fecha = String(fecha);
        }
        data.banco = String(jsonData[3][7] || '');
        data.fase = String(jsonData[3][9] || '');
        data.mallasAsociadas = String(jsonData[3][13] || '');
    }

    // Extraer personal
    if (jsonData[7] && jsonData[7][4]) data.ingPlanificador = String(jsonData[7][4]);
    if (jsonData[10] && jsonData[10][4]) data.geotecnico = String(jsonData[10][4]);
    if (jsonData[15] && jsonData[15][4]) data.jefeTurno = String(jsonData[15][4]);
    if (jsonData[18] && jsonData[18][4]) data.ingProgramacion = String(jsonData[18][4]);
    if (jsonData[21] && jsonData[21][4]) data.supervisorPyT = String(jsonData[21][4]);

    // Extraer coordenadas
    if (jsonData[7]) {
        data.puntoInicio_X = String(jsonData[7][12] || '');
        data.puntoInicio_Y = String(jsonData[7][13] || '');
        data.puntoInicio_Z = String(jsonData[7][14] || '');
    }
    if (jsonData[10]) {
        data.puntoFinal_X = String(jsonData[10][12] || '');
        data.puntoFinal_Y = String(jsonData[10][13] || '');
        data.puntoFinal_Z = String(jsonData[10][14] || '');
    }

    // Extraer evaluaciones
    if (jsonData[38] && jsonData[38][13] === 'X') {
        data.cumpleLineaDiseno = 'Si';
    } else if (jsonData[38] && jsonData[38][14] === 'X') {
        data.cumpleLineaDiseno = 'No';
    }

    // Factor de Condición
    if (jsonData[42]) data.bloquesInestables_eval = String(jsonData[42][13] || '');
    if (jsonData[43]) data.bloquesInestables_puntaje = String(jsonData[43][13] || '');
    if (jsonData[44]) data.discontinuidades_eval = String(jsonData[44][13] || '');
    if (jsonData[45]) data.discontinuidades_puntaje = String(jsonData[45][13] || '');
    if (jsonData[46]) data.crestaDelTalud_eval = String(jsonData[46][13] || '');
    if (jsonData[47]) data.crestaDelTalud_puntaje = String(jsonData[47][13] || '');
    if (jsonData[48]) data.geometriaPerfil_eval = String(jsonData[48][13] || '');
    if (jsonData[49]) data.geometriaPerfil_puntaje = String(jsonData[49][13] || '');
    if (jsonData[50]) data.caraTalud_eval = String(jsonData[50][13] || '');
    if (jsonData[51]) data.caraTalud_puntaje = String(jsonData[51][13] || '');

    if (jsonData[52]) data.puntajeTotal = String(jsonData[52][13] || '');
    if (jsonData[54]) data.cumpleFactorCondicion = String(jsonData[54][13] || '');
    if (jsonData[55]) data.metrosEvaluados = String(jsonData[55][13] || '');

    // Pretil
    if (jsonData[59]) {
        if (jsonData[59][13] === 'X') data.pretilCumpleLinea = 'Si';
        else if (jsonData[59][14] === 'X') data.pretilCumpleLinea = 'No';
    }
    if (jsonData[60]) {
        if (jsonData[60][13] === 'X') data.pretilCumpleAltura = 'Si';
        else if (jsonData[60][14] === 'X') data.pretilCumpleAltura = 'No';
    }

    // Precortes
    if (jsonData[64]) {
        data.pcInicio = String(jsonData[64][12] || '');
        data.pcFinal = String(jsonData[64][14] || '');
    }

    // Observaciones
    if (jsonData[69] && jsonData[69][1]) data.obsGeotecnia = String(jsonData[69][1]);
    if (jsonData[71] && jsonData[71][1]) data.obsCyT = String(jsonData[71][1]);
    if (jsonData[74] && jsonData[74][1]) data.obsPCP = String(jsonData[74][1]);
    if (jsonData[77] && jsonData[77][1]) data.obsGPO = String(jsonData[77][1]);
    if (jsonData[80] && jsonData[80][1]) data.obsPyT = String(jsonData[80][1]);

    return data;
}

async function processData() {
    if (!workbook) return;

    document.getElementById('loading').classList.add('show');

    // Necesitamos un pequeño delay para que la UI actualice el loading
    setTimeout(async () => {
        processedData = [];

        // Procesar hoja por hoja
        for (let sheetName of workbook.SheetNames) {
            if (sheetName !== 'FORMATO EN BLANCO') {
                try {
                    const data = extractSheetData(sheetName);

                    // Extraer imágenes si existe ExcelJS
                    if (excelJsWorkbook) {
                        const worksheet = excelJsWorkbook.getWorksheet(sheetName);
                        if (worksheet) {
                            const images = worksheet.getImages();
                            const imageList = [];

                            for (const image of images) {
                                const imgId = image.imageId;
                                const imgData = excelJsWorkbook.getImage(imgId);
                                // imgData tiene { buffer, extension }
                                const base64 = bufferToBase64(imgData.buffer);
                                const mimeType = imgData.extension === 'png' ? 'image/png' : 'image/jpeg';
                                imageList.push({
                                    src: `data:${mimeType};base64,${base64}`,
                                    range: image.range // Información de posición por si acaso
                                });
                            }
                            data.images = imageList;
                        }
                    }

                    // Validar contenido relevante
                    if (data.numeroEntrega || data.fecha || data.banco || data.fase) {
                        data._id = processedData.length; // ID único para evitar problemas con strings
                        processedData.push(data);
                    }
                } catch (e) {
                    console.warn(`Error al procesar la hoja "${sheetName}":`, e);
                }
            }
        }

        // Mostrar estadísticas
        updateStats();

        // Crear tablas
        createTables();

        // Inicializar filtros
        initializeFilters();

        // Crear workbook para descarga
        createExcelWorkbook();

        document.getElementById('loading').classList.remove('show');
        document.getElementById('stats').style.display = 'block';
        document.getElementById('tabsContainer').style.display = 'block';
        document.getElementById('downloadBtn').style.display = 'inline-block';
    }, 100);
}
