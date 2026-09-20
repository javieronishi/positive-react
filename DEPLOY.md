# 🚀 Guía de Despliegue en GitHub Pages con CI/CD

Esta guía detalla los pasos para publicar y desplegar automáticamente la aplicación **Positive React** en **GitHub Pages** utilizando **GitHub Actions** para integración y entrega continua (CI/CD).

---

## ⚙️ 1. Configuración Ya Integrada en el Proyecto

El proyecto ya cuenta con los dos elementos esenciales listos:

1. **Rutas relativas en [vite.config.ts](file:///home/javier/Code/positive-react/vite.config.ts):**
   ```ts
   export default defineConfig({
     plugins: [react()],
     base: './', // Permite que los scripts y estilos carguen sin importar el nombre del repo
   })
   ```

2. **Pipeline de GitHub Actions en [.github/workflows/deploy.yml](file:///home/javier/Code/positive-react/.github/workflows/deploy.yml):**
   - Se ejecuta automáticamente ante cada `push` a la rama `main`.
   - Instala dependencias (`npm ci`).
   - Valida la calidad del código (`npm run lint`).
   - Compila la versión de producción (`npm run build`).
   - Despliega el artefacto en GitHub Pages sin requerir ramas intermedias como `gh-pages`.

---

## 📋 2. Pasos para Publicar el Proyecto

### Paso 1: Crear el primer commit local

Abre tu terminal en la raíz del proyecto y ejecuta:

```bash
# 1. Agregar todos los archivos al área de preparación
git add .

# 2. Confirmar los cambios con un mensaje descriptivo
git commit -m "feat: interfaz moderna, compartir en redes y CI/CD para GitHub Pages"
```

---

### Paso 2: Crear el repositorio en GitHub

1. Ingresa a tu cuenta en [github.com/new](https://github.com/new).
2. **Repository name:** Escribe el nombre del proyecto (por ejemplo: `positive-react`).
3. **Visibility:** Selecciona **Public** *(en cuentas personales gratuitas, GitHub Pages requiere que el repositorio sea público)*.
4. **Importante:** **NO** marques las opciones *Add a README file*, *Add .gitignore* ni *Choose a license*, ya que el proyecto ya las contiene localmente.
5. Haz clic en el botón verde **Create repository**.

---

### Paso 3: Conectar el repositorio y subir el código

En tu terminal, ejecuta los siguientes comandos sustituyendo `<tu-usuario>` por tu nombre de usuario en GitHub y `<nombre-repo>` por el nombre que le diste al repositorio:

```bash
# Asegurarse de que la rama principal se llame main
git branch -M main

# Vincular tu repositorio local con el repositorio remoto en GitHub
git remote add origin https://github.com/<tu-usuario>/<nombre-repo>.git

# Subir tu código a la rama main
git push -u origin main
```

---

### Paso 4: Habilitar GitHub Pages desde GitHub Actions

1. Ve a la página de tu repositorio en GitHub.
2. Haz clic en la pestaña **Settings** (Configuración en la barra superior).
3. En el menú lateral izquierdo, dentro de la sección **Code and automation**, haz clic en **Pages**.
4. En el apartado **Build and deployment**:
   - En el menú desplegable **Source**, selecciona: **GitHub Actions** *(en lugar de "Deploy from a branch")*.
5. Guarda los cambios si es necesario (generalmente se aplica de forma automática).

---

## 🔄 3. ¿Cómo Funciona el CI/CD a Partir de Ahora?

A partir de este momento, cada vez que hagas un cambio y lo subas:

```bash
git add .
git commit -m "fix: ajuste menor"
git push
```

1. GitHub Actions detectará el `push` automáticamente.
2. Puedes ver el avance en tiempo real en la pestaña **Actions** de tu repositorio.
3. Al terminar (tarda menos de 1 minuto), el sitio estará actualizado en:
   ```text
   https://<tu-usuario>.github.io/<nombre-repo>/
   ```

---

## 🛠️ 4. Solución de Dudas Frecuentes

* **¿Por qué la página me da error 404 al abrirla recién terminada la acción?**
  GitHub Pages puede tardar entre 1 y 2 minutos en propagar los DNS la primera vez que se publica. Espera un par de minutos y refresca con `Ctrl + F5` (o `Cmd + Shift + R`).
* **¿Qué pasa si el linter falla durante el despliegue?**
  El pipeline cancelará el despliegue automáticamente para evitar publicar código con errores. Puedes ejecutar `npm run lint` localmente para corregirlos antes de hacer `git push`.
