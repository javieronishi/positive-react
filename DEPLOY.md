# 🚀 Guía de Despliegue en GitHub Pages con CI/CD

Esta guía detalla la configuración y el flujo de publicación continua de **Positive React** en **GitHub Pages** utilizando **GitHub Actions** (CI/CD).

* **Repositorio:** [github.com/javieronishi/positive-react](https://github.com/javieronishi/positive-react)
* **URL de Producción:** [https://javieronishi.github.io/positive-react/](https://javieronishi.github.io/positive-react/)

---

## ⚙️ 1. Configuración Integrada en el Proyecto

El proyecto ya cuenta con la infraestructura lista para producción en GitHub Pages:

### 1. Rutas relativas en [vite.config.ts](file:///home/javier/Code/positive-react/vite.config.ts)
```ts
export default defineConfig({
  plugins: [react()],
  base: './', // Garantiza que assets, scripts y estilos resuelvan correctamente bajo subcarpetas (/positive-react/)
})
```

### 2. Archivo Completo de CI/CD: [.github/workflows/deploy.yml](file:///home/javier/Code/positive-react/.github/workflows/deploy.yml)

Este es el archivo oficial y completo recomendado por GitHub para proyectos web estáticos modernos:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches:
      - main
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: 'pages'
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout del código
        uses: actions/checkout@v4

      - name: Configurar Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Instalar dependencias
        run: npm ci

      - name: Verificar calidad de código (ESLint)
        run: npm run lint

      - name: Compilar proyecto
        run: npm run build

      - name: Configurar GitHub Pages
        uses: actions/configure-pages@v5

      - name: Subir artefacto para Pages
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Desplegar en GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

### 🔍 Explicación Detallada: ¿Por qué GitHub Recomienda Esta Estructura?

Cada bloque de este archivo cumple una función específica. A continuación se desglosa qué es estrictamente necesario y qué aporta cada recomendación:

#### 1. Disparadores (`on:`)
* `push: branches: [main]`: **(Obligatorio)** Hace que el pipeline se ejecute automáticamente cada vez que subes código a la rama principal.
* `workflow_dispatch:` **(Recomendado)** Agrega el botón manual **"Run workflow"** en la pestaña Actions de GitHub. Te permite forzar un despliegue sin tener que hacer un commit vacío.

#### 2. Permisos (`permissions:`) — ⚠️ Obligatorio
* `contents: read`: Permite a la máquina virtual clonar y leer el código del repo.
* `pages: write` y `id-token: write`: **Cruciales.** GitHub Pages moderno utiliza tokens OIDC para autenticar el despliegue. Sin estos dos permisos, la acción fallará con error `403 Forbidden`.

#### 3. Concurrencia (`concurrency:`) — 💡 Recomendado
* `group: 'pages'` y `cancel-in-progress: true`: Si haces dos `push` muy seguidos, cancela automáticamente el despliegue anterior que quedó obsoleto y procesa el más reciente. Ahorra minutos de ejecución y evita que una versión vieja sobreescriba a una nueva.

#### 4. Separación en Dos Jobs (`build` y `deploy`) — 🏗️ Buena Práctica
GitHub recomienda desacoplar la **construcción** del **despliegue**:
* **Job `build`:**
  - `actions/checkout@v4`: **(Obligatorio)** Descarga el código del repositorio en el runner de Ubuntu.
  - `actions/setup-node@v4` con `cache: 'npm'`: Configura Node.js 20. La opción `cache: 'npm'` almacena dependencias en caché, reduciendo el tiempo de descarga de ~40s a ~5s en cada ejecución.
  - `npm ci`: **(Obligatorio en CI)** A diferencia de `npm install`, `npm ci` instala exclusivamente las versiones fijas de `package-lock.json` de manera rápida y sin alterar archivos.
  - `npm run lint`: **(Control de Calidad)** Ejecuta ESLint. Si hay errores graves de sintaxis o variables rotas, cancela el pipeline para no publicar una versión dañada.
  - `npm run build`: **(Obligatorio)** Ejecuta `tsc -b && vite build` generando los archivos estáticos en `./dist`.
  - `actions/configure-pages@v5`: Inyecta metadatos de configuración en Pages.
  - `actions/upload-pages-artifact@v3`: **(Obligatorio)** Empaqueta `./dist` como un artefacto seguro y comprimido listo para publicación.
* **Job `deploy`:**
  - `needs: build`: Garantiza que solo se intente publicar si la compilación fue exitosa.
  - `environment: name: github-pages`: Registra el historial de despliegues en GitHub y muestra el enlace público del sitio directamente en la interfaz.
  - `actions/deploy-pages@v4`: **(Obligatorio)** Toma el artefacto empaquetado y lo distribuye en la red CDN de GitHub Pages.

---

### 📊 Resumen: ¿Qué es Indispensable vs Opcional?

| Elemento | ¿Es obligatorio? | ¿Qué ocurre si lo quitas? |
| :--- | :---: | :--- |
| `permissions: pages & id-token` | **SÍ** | El despliegue falla por falta de permisos (Error 403). |
| `actions/checkout` | **SÍ** | La máquina virtual no tiene código que compilar. |
| `actions/setup-node` y `npm ci` | **SÍ** | No hay entorno de Node ni dependencias instaladas. |
| `npm run build` | **SÍ** | No se genera la carpeta `./dist`. |
| `upload-pages-artifact` & `deploy-pages` | **SÍ** | El artefacto no se envía ni se publica en GitHub Pages. |
| `workflow_dispatch` | *Opcional* | Pierdes la opción de desplegar manualmente con un clic. |
| `concurrency` | *Opcional* | Múltiples pushes seguidos compilarán todos a la vez. |
| `cache: 'npm'` | *Opcional* | Cada ejecución tardará entre 20 y 40 segundos más. |
| `npm run lint` | *Opcional* | Si tu código tiene advertencias de estilo, igual se publicará. |

---

## 📋 2. Pasos para la Configuración Inicial (Solo la primera vez)

> [!NOTE]
> En este repositorio el código ya está vinculado y subido a la rama `main`. Solo asegúrate de haber realizado el **Paso 4** en la web de GitHub.

### Paso 1: Confirmar cambios locales *(ya realizado)*
```bash
git add .
git commit -m "feat: interfaz moderna, compartir en redes y CI/CD para GitHub Pages"
```

### Paso 2: Crear el repositorio en GitHub *(ya realizado)*
- Repositorio público: `positive-react`.

### Paso 3: Vincular y subir rama principal *(ya realizado)*
```bash
git branch -M main
git remote add origin git@github.com:javieronishi/positive-react.git
git push -u origin main
```

### Paso 4: Habilitar GitHub Pages desde GitHub Actions ⚠️ *(Paso Clave)*

Para que el workflow tenga autorización de publicar la web:

1. Ve a [github.com/javieronishi/positive-react/settings/pages](https://github.com/javieronishi/positive-react/settings/pages).
2. En el apartado **Build and deployment**:
   - En el menú desplegable **Source**, selecciona: **GitHub Actions** *(no "Deploy from a branch")*.
3. Guarda los cambios si es necesario.

---

## 🔄 3. Flujo de Trabajo Diario (CI/CD Automático)

Cada vez que realices mejoras en la aplicación:

```bash
# 1. Realiza tus modificaciones y confírmalas
git add .
git commit -m "feat: nueva frase motivacional o ajuste de diseño"

# 2. Sube los cambios
git push origin main
```

1. **Detección automática:** GitHub Actions iniciará inmediatamente el pipeline.
2. **Seguimiento en vivo:** Puedes observar el progreso en la pestaña [Actions](https://github.com/javieronishi/positive-react/actions).
3. **Despliegue completado:** En menos de 1 minuto, la web se actualizará automáticamente en:
   ```text
   https://javieronishi.github.io/positive-react/
   ```

### ⚡ Ejecución Manual del Despliegue (`workflow_dispatch`)
Gracias al disparador `workflow_dispatch`, si deseas forzar un nuevo despliegue sin realizar un commit:
1. Ve a la pestaña **Actions** en tu repositorio en GitHub.
2. Selecciona **Deploy to GitHub Pages** en la barra lateral izquierda.
3. Haz clic en el botón desplegable **Run workflow**, elige la rama `main` y presiona el botón verde **Run workflow**.

---

## 🔐 4. Manejo de Variables de Entorno (.env y GitHub Secrets)

### 🚫 ¿Por qué NUNCA se debe subir el archivo `.env`?
El archivo `.env` suele contener claves de API, URLs privadas o configuraciones específicas de tu entorno local. Si lo subes a GitHub:
- Quedará registrado en el historial de Git (incluso si lo borras en un commit posterior).
- Estará expuesto públicamente si el repositorio es abierto.

**Regla de oro:** El archivo `.env` siempre debe estar incluido en [.gitignore](file:///home/javier/Code/positive-react/.gitignore). Como buena práctica, puedes subir un archivo plantilla llamado `.env.example` sin valores sensibles:

```env
# .env.example (este archivo sí se sube a GitHub como referencia)
VITE_API_URL=https://api.ejemplo.com
VITE_ANALYTICS_ID=tu_id_aqui
```

---

### ⚙️ Cómo agregar Variables y Secretos en GitHub

Para que GitHub Actions tenga acceso a estas variables durante el despliegue:

1. Ve a tu repositorio en GitHub: [github.com/javieronishi/positive-react](https://github.com/javieronishi/positive-react).
2. Haz clic en **Settings** > en el menú lateral selecciona **Secrets and variables** > **Actions**.
3. Elige el tipo según la sensibilidad del dato:
   - **Secrets (Recomendado para datos confidenciales):** Haz clic en **New repository secret**. El valor se almacena encriptado y nunca se mostrará en los logs.
   - **Variables (Para configuraciones públicas):** Haz clic en la pestaña **Variables** > **New repository variable**.

---

### 📥 Cómo inyectar las Variables en [.github/workflows/deploy.yml](file:///home/javier/Code/positive-react/.github/workflows/deploy.yml)

En aplicaciones construidas con Vite, las variables de entorno se incrustan en el código empaquetado **durante la compilación** (`npm run build`).

Debes pasarlas dentro del paso `Compilar proyecto` en el archivo de workflow:

```yaml
      - name: Compilar proyecto
        run: npm run build
        env:
          # Para valores guardados en Secrets:
          VITE_API_URL: ${{ secrets.VITE_API_URL }}
          
          # Para valores guardados en Variables públicas:
          VITE_APP_TITLE: ${{ vars.VITE_APP_TITLE }}
```

---

### 📌 Reglas de Vite en el Código React

1. **Prefijo obligatorio `VITE_`:** Vite solo expone al cliente las variables que comiencen con `VITE_`:
   ```ts
   // Uso en tus componentes React:
   const apiUrl = import.meta.env.VITE_API_URL;
   ```
2. **Desarrollo local:** En tu máquina creas el archivo `.env` en la raíz del proyecto:
   ```env
   VITE_API_URL=https://api.ejemplo.com
   ```

---

### ⚠️ Advertencia Crítica de Seguridad en Frontend (SPA)

> [!CAUTION]
> **Todo lo que usa React / Vite se ejecuta en el navegador del usuario final.**
> Aunque una variable provenga de un *GitHub Secret*, cuando Vite ejecuta `npm run build`, reemplaza el código con el valor en texto plano dentro de los archivos JavaScript finales en `./dist`.
>
> - **SÍ puedes guardar en el frontend:** URLs de APIs públicas, Firebase Public Keys, IDs de Google Analytics o temas visuales.
> - **NUNCA pongas en el frontend:** Claves privadas de backend (como `OPENAI_API_KEY`, `STRIPE_SECRET_KEY`, contraseñas de bases de datos o tokens con permisos administrativos). Cualquier usuario puede verlas abriendo la consola o el inspector del navegador. Esos secretos deben residir exclusivamente en un servidor backend.

---

## 🛠️ 5. Solución de Problemas Frecuentes

* **Error `403: Not allowed to deploy to github-pages environment` en la Action:**
  - **Causa:** No se configuró el origen de GitHub Pages en modo Actions.
  - **Solución:** Revisa el **Paso 4** y asegúrate de que en *Settings > Pages > Source* esté seleccionado **GitHub Actions**.

* **El workflow falla en el paso `npm ci`:**
  - **Causa:** Se modificó `package.json` manualmente sin regenerar `package-lock.json`.
  - **Solución:** Corre `npm install` localmente para sincronizar el lockfile y sube el commit resultante (`git add package.json package-lock.json && git commit -m "fix: sync package-lock"`).

* **El workflow falla en `npm run lint` o `npm run build`:**
  - **Causa:** Hay errores de linting o errores de tipos de TypeScript (`tsc -b`).
  - **Solución:** Ejecuta `npm run lint` y `npm run build` en tu terminal local para identificar y corregir el error antes de hacer `push`. El pipeline detiene el despliegue a propósito para evitar publicar código roto.

* **Error 404 la primera vez que visitas la URL:**
  - **Causa:** GitHub Pages puede tardar de 1 a 2 minutos en propagar el DNS la primera vez que se publica el sitio.
  - **Solución:** Espera un par de minutos y recarga la página forzando la limpieza de caché con `Ctrl + F5` (o `Cmd + Shift + R`).
