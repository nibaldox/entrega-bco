# Visualizador de Entregas de Banco 📊

![Status](https://img.shields.io/badge/Status-Activo-success)
![Version](https://img.shields.io/badge/Version-1.0.0-blue)

Una herramienta web moderna para la visualización, análisis y consolidación de datos de entregas de banco geotécnicas. Diseñada para funcionar completamente en el navegador sin necesidad de backend.

## 🚀 Características

-   **Procesamiento Local**: Carga y procesa archivos Excel directamente en el navegador.
-   **Dashboard Interactivo**: Visualiza estadísticas clave (Total de entregas, Metros evaluados, Cumplimiento).
-   **Filtros Avanzados**: Filtra por Fase, Banco, Cumplimiento y Puntaje con búsqueda en tiempo real.
-   **Modo Oscuro (Deep Blue)**: Interfaz moderna con tema oscuro optimizado y cuidado estético.
-   **Exportación de Datos**: Genera reportes en Excel filtrados según la vista actual.
-   **Galería de Imágenes**: Visualiza evidencias fotográficas asociadas a cada entrega.

## 🛠️ Tecnologías

-   **HTML5 / CSS3**: Diseño responsivo y variables CSS para theming.
-   **JavaScript (ES6+)**: Lógica de procesamiento de datos y manipulación del DOM.
-   **SheetJS (xlsx)**: Lectura y procesamiento de archivos Excel.
-   **ExcelJS**: Generación y exportación de reportes avanzados.
-   **Lodash**: Utilidades para manipulación de datos.

## 📖 Uso

1.  Abre la aplicación (o visita el deploy en GitHub Pages).
2.  Carga el archivo Excel de entregas (formato estándar).
3.  Utiliza los filtros para explorar los datos.
4.  Cambia entre las pestañas "Datos Consolidados", "Resumen" y "Evaluaciones".
5.  Exporta los resultados si es necesario.

Para más detalles, consulta el [Manual de Usuario](MANUAL_USUARIO.md).

## 📄 Estructura del Proyecto

```
/
├── index.html          # Punto de entrada principal
├── css/
│   └── styles.css      # Estilos y temas (Claro/Oscuro)
├── js/
│   ├── app.js          # Lógica principal e inicialización
│   ├── data.js         # Procesamiento de datos Excel
│   ├── ui.js           # Renderizado de tablas y dashboard
│   └── export.js       # Lógica de exportación
└── MANUAL_USUARIO.md   # Documentación detallada
```

## 📝 Licencia

Este proyecto es de uso interno/privado.
