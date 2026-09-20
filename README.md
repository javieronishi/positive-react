# ✨ Frases Positivas — Dosis Diaria de Inspiración

Una aplicación web moderna, minimalista y ultra-rápida construida con **React 19**, **TypeScript** y **Vite**. Diseñada para ofrecer reflexiones y frases motivacionales instantáneas con una experiencia de usuario fluida y estética *glassmorphism*.

---

## 🚀 Características

- ⚡ **Carga Instantánea:** Conexión directa y rápida a la API sin retardos artificiales.
- 🎨 **Diseño Moderno & Glassmorphism:** Modo oscuro inmersivo, iluminación ambiental con gradientes sutiles y tipografía moderna (`Outfit` y `Plus Jakarta Sans`).
- 📋 **Copiado al Portapapeles:** Botón integrado con confirmación visual (*¡Copiado!*) para compartir o guardar tus citas favoritas.
- 🌐 **Compartir en Redes Sociales:**
  - **WhatsApp:** Comparte la cita directamente formateada en un chat o estado.
  - **X:** Publica en X con un solo clic y hashtags motivacionales incluidos.
  - **Telegram:** Envía la frase a tus contactos o canales.
  - **Web Share API:** Despliega el menú nativo de compartir en dispositivos y navegadores compatibles.
- ⌨️ **Atajo de Teclado:** Presiona la tecla <kbd>Espacio</kbd> en cualquier momento para descubrir una nueva frase al instante.
- 📜 **Historial de Sesión:** Registro cronológico de todas las frases consultadas con su hora exacta de obtención y opción para limpiar el historial.
- 📱 **100% Responsivo:** Experiencia optimizada tanto para smartphones como para tablets y ordenadores.

---

## 🛠️ Tecnologías Utilizadas

- **Framework:** [React 19](https://react.dev/)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Empaquetador & Dev Server:** [Vite 8](https://vitejs.dev/)
- **Estilos:** CSS3 nativo con CSS Custom Properties (Variables de diseño y Flexbox/Grid)
- **Linter:** [ESLint](https://eslint.org/) (Flat Config)
- **API Externa:** [Positive API](https://www.positive-api.online/)

---

## 📂 Estructura del Proyecto

```text
positive-react/
├── public/                  # Recursos estáticos
├── src/
│   ├── components/          # Componentes modulares
│   │   ├── Loading.tsx      # Indicador de carga con spinner y aura brillante
│   │   ├── PhraseCard.tsx   # Tarjeta de frase, copiado y botones de redes
│   │   └── PhraseHistory.tsx# Lista cronológica e historial de frases
│   ├── services/
│   │   └── phrase.service.ts# Servicio de consumo de la API REST
│   ├── types/
│   │   └── phrase.ts        # Interfaces y tipos de TypeScript
│   ├── App.css              # Estilos de la aplicación y componentes
│   ├── App.tsx              # Componente raíz y gestión de estado
│   ├── index.css            # Reset, tokens de diseño y tipografías
│   └── main.tsx             # Punto de entrada de React
├── index.html               # Plantilla HTML con fuentes y metadatos SEO
├── package.json             # Dependencias y scripts del proyecto
├── tsconfig.json            # Configuración de TypeScript
└── vite.config.ts           # Configuración de Vite
```

---

## 💻 Instalación y Uso Local

### Requisitos previos

- [Node.js](https://nodejs.org/) (versión 18 o superior recomendada)
- [npm](https://www.npmjs.com/)

### Pasos

1. **Clonar o descargar el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd positive-react
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador para ver la aplicación.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

5. **Previsualizar la versión de producción:**
   ```bash
   npm run preview
   ```

6. **Ejecutar el linter:**
   ```bash
   npm run lint
   ```

---

## 📄 Licencia

Este proyecto es de uso libre bajo fines educativos o personales.
