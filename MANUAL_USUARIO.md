# Manual de Usuario - Visualizador de Entregas de Banco

Bienvenido al **Procesador de Entregas de Banco**, una plataforma diseñada para el análisis, consolidación y visualización de datos geotécnicos. Este manual le guiará a través de todas las funcionalidades disponibles en la herramienta.

## 📋 Índice
1. [Primeros Pasos](#primeros-pasos)
2. [Carga de Datos](#carga-de-datos)
3. [Panel de Control (Dashboard)](#panel-de-control)
4. [Filtrado de Información](#filtrado-de-información)
5. [Vistas de Datos](#vistas-de-datos)
6. [Exportación](#exportación)
7. [Personalización (Modo Oscuro)](#personalización)

---

## 🚀 Primeros Pasos

Para comenzar a utilizar la aplicación, simplemente abra el archivo `index.html` en su navegador web favorito (se recomienda Google Chrome, Edge o Firefox). 

No se requiere instalación de software adicional ni conexión a internet para el procesamiento básico, ya que la herramienta funciona localmente en su equipo.

---

## 📂 Carga de Datos

1.  Haga clic en el botón **"Cargar Excel"** o en el área designada en la parte superior.
2.  Seleccione su archivo `.xlsx` o `.xls` que contiene los datos de las entregas.
3.  Una vez seleccionado, el sistema reconocerá el archivo.
4.  Haga clic en **"Procesar Datos"** para iniciar el análisis.

> **Nota Adicional:** El sistema está configurado para buscar automáticamente un archivo llamado `Copia de ENTREGA DE BANCO CON NUEVO FORMATO 2025_.xlsx` en la misma carpeta. Si este archivo existe, se cargará y procesará automáticamente al abrir la aplicación.

---

## 📊 Panel de Control

Una vez procesados los datos, verá cuatro (4) tarjetas de estadísticas clave en la parte superior:

*   **TOTAL ENTREGAS**: Número total de registros procesados.
*   **METROS EVALUADOS**: Suma total de los metros lineales evaluados.
*   **PROMEDIO PUNTAJE FC**: Promedio global del puntaje de Factor Condicionante.
*   **CUMPLIMIENTO FC**: Porcentaje de entregas que cumplen con el estándar ("Si").

---

## 🔍 Filtrado de Información

Debajo de las estadísticas encontrará el **Panel de Filtros Avanzados**. Utilice estas herramientas para refinar los datos que ve en pantalla:

*   **Búsqueda Global**: Escriba cualquier texto (ID, nombre de banco, fase) para buscar en todos los campos.
*   **Fase**: Seleccione una fase específica del menú desplegable.
*   **Banco**: Filtre por un número de banco específico.
*   **Cumplimiento**: Vea solo los que "Cumplen" o "No Cumplen".
*   **Puntaje Min.**: Ingrese un número (0-100) para ver entregas con puntaje superior a ese valor.

> **Tip:** Al aplicar filtros, todas las estadísticas y gráficas se actualizarán automáticamente para reflejar solo los datos visibles.

---

## 📑 Vistas de Datos

La aplicación ofrece tres pestañas principales para visualizar la información:

### 1. Datos Consolidados
Esta es la vista detallada principal. Muestra una tabla con cada entrega individual. 
*   Puede ordenar las columnas haciendo clic en los encabezados.
*   Si una entrega tiene fotos asociadas, verá un botón azul con el icono de cámara 📷. Haga clic para abrir la **Galería de Imágenes**.

### 2. Resumen
Una vista agrupada ideal para reportes ejecutivos.
*   **Por Fase**: Vea el rendimiento promedio y totales agrupados por Fase.
*   **Por Banco**: Vea el rendimiento promedio y totales agrupados por Banco.
*   Cambie entre estas sub-vistas usando los botones "Por Fase" y "Por Banco" dentro de la pestaña.

### 3. Evaluaciones FC
Muestra el detalle técnico de la evaluación geotécnica, incluyendo:
*   Bloques Inestables
*   Discontinuidades
*   Cresta del Talud
*   Geometría
*   Observaciones específicas

---

## 📥 Exportación

Puede exportar los datos que está visualizando actualmente (incluyendo los filtros aplicados) para su uso en otros reportes.

1.  Haga clic en el botón **"Exportar Vista"** (o "Exportar Vista Actual").
2.  Se abrirá un menú donde puede confirmar el formato (Excel es el predeterminado).
3.  Confirme la descarga. Se generará un archivo Excel con múltiples hojas (Datos, Resumen, etc.).

---

## 🌙 Personalización (Modo Oscuro)

Para trabajar cómodamente en ambientes con poca luz o simplemente por preferencia estética:

1.  Ubique el botón flotante en la esquina superior derecha de la sección de título (Icono de Luna 🌙 o Sol ☀️).
2.  Haga clic para alternar entre el **Modo Claro** y el **Modo Oscuro (Deep Blue)**.
3.  Su preferencia se guardará automáticamente para la próxima vez que abra la aplicación.

---

**Soporte Técnico**
Si encuentra problemas con la visualización de datos, asegúrese de que su archivo Excel cumple con el formato estándar esperado (columnas de Fecha, Banco, Fase, etc.).

---

## 🛠️ Solución de Problemas (GitHub Pages)

Si al intentar activar GitHub Pages te solicita un **"Dominio Verificado"**, sigue estos pasos:

1.  Ve a **Settings > Pages**.
2.  En **"Build and deployment"**, asegúrate de que **Source** sea **"Deploy from a branch"**.
3.  Selecciona la rama `master` y guarda.
4.  **IMPORTANTE**: Deja el campo **"Custom domain"** completamente **VACÍO**. No es necesario para usar la versión gratuita.

