// Cargar automáticamente si hay un archivo disponible
window.addEventListener('load', async () => {
    // Intentar cargar el archivo si está disponible
    if (window.fs && window.fs.readFile) {
        try {
            const response = await window.fs.readFile('Copia de ENTREGA DE BANCO CON NUEVO FORMATO 2025_.xlsx');
            workbook = XLSX.read(response, {
                cellDates: true,
                cellStyles: true
            });
            document.getElementById('processBtn').style.display = 'inline-block';
            // Procesar automáticamente
            processData();
        } catch (error) {
            console.log('Archivo no disponible, esperando carga manual');
        }
    }
});
