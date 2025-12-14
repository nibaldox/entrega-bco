// Cargar automáticamente si hay un archivo disponible
window.addEventListener('load', async () => {
    // Inicializar tema
    initTheme();

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

// Theme Logic
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
    const icon = document.getElementById('themeIcon');
    if (icon) {
        icon.textContent = theme === 'dark' ? '☀️' : '🌙';
    }
}

// Make globally available
window.toggleTheme = toggleTheme;
