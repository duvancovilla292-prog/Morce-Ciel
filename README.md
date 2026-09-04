# Morse Ciel 🫥

<img width="745" height="647" alt="image" src="https://github.com/user-attachments/assets/073b4980-1a01-41a9-ac50-17dc8868eee5" />

## Análisis Técnico del Proyecto

**Morse Ciel** es una *Single Page Application (SPA)* enfocada en el aprendizaje algorítmico y sensorial del código Morse. Desarrollada puramente en Vanilla JS, no requiere dependencias externas e implementa síntesis de audio nativa.

### Stack Tecnológico
*   **Presentación:** HTML5 semántico. Renderizado modular gestionado por manipulación de clases DOM.
*   **Estilos:** CSS3 nativo. Arquitectura *Mobile-First*, sistema de diseño por variables (`:root`), y deshabilitación del retardo táctil (`touch-action: manipulation`).
*   **Lógica de Control:** JavaScript (ES6). Implementación de la `Web Audio API` para generación de ondas senoidales a 700Hz.

## Arquitectura de Modos de Evaluación

El sistema abstrae el aprendizaje en tres canales cognitivos y herramientas de apoyo:

| Módulo | Mecánica de Procesamiento |
| :--- | :--- |
| **Clásico** | Visualización de carácter ➔ Codificación e ingreso mediante telégrafo (`.` y `-`). |
| **Visual** | Lectura de secuencia Morse ➔ Decodificación a carácter alfanumérico. |
| **Auditivo** | Recepción de ráfaga de audio ➔ Decodificación en tiempo real a carácter. |
| **Traductor** | Conversor bidireccional (Texto ⭤ Morse) de complejidad computacional lineal. |
| **Manual** | Diccionario de referencia particionado (Letras / Números). |

## Ejecución y Despliegue

La aplicación se ejecuta en el lado del cliente (Client-Side). 

1.  Clona el entorno y preserva la jerarquía del árbol de directorios:
    ```text
    /
    ├── index.html
    ├── css/
    │   └── style.css
    └── js/
        └── main.js
    ```
2.  Inicia el sistema abriendo `index.html` en cualquier motor de renderizado web moderno (Chromium, Gecko, WebKit). No requiere servidor web local (localhost) para su funcionamiento base.
