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
// Theme Logic
const MOON_PATH = "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z";
const SUN_PATH = "M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z";

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
    const svg = document.getElementById('themeIconSvg');
    if (svg) {
        // Clear existing content
        svg.innerHTML = '';

        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", theme === 'dark' ? SUN_PATH : MOON_PATH);

        // Adjust fill/stroke based on icon type if needed, but simple path switch is enough for these icons
        // Moon is usually filled or thick stroke, Sun is stroke.
        // Let's use fill="currentColor" for Moon and stroke="currentColor" for Sun for better style? 
        // Actually, let's keep it simple: both use stroke or fill as defined in CSS or inline.
        // For consistent minimalist look: 
        // Moon: Fill (or stroke with fill)
        // Sun: Stroke (rays) + Fill (center)

        // Simplest consistent approach:
        if (theme === 'dark') {
            // Sun icon (outline style)
            svg.setAttribute("fill", "none");
            svg.setAttribute("stroke", "currentColor");
        } else {
            // Moon icon (filled style looks better usually)
            svg.setAttribute("fill", "currentColor");
            svg.setAttribute("stroke", "none");
        }

        svg.appendChild(path);
    }
}

// Make globally available
window.toggleTheme = toggleTheme;
