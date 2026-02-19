# 🎨 Manual de Personalización para Principiantes

Este manual está diseñado para que cualquier persona, incluso con conocimientos básicos de desarrollo, pueda adaptar NaturaJM V3 a su propia marca.

## 1. Cambiar la Identidad Visual (Colores)

El proyecto utiliza un sistema de temas centralizado. Para cambiar los colores de toda la aplicación:

- Abre el archivo `styles/theme.ts`.
- Busca la sección `colors`.
- Cambia el código hexadecimal de `primary` (el verde actual `#7BB32E`) por el color de tu marca.
- **Dato:** La aplicación actualizará automáticamente botones, iconos y resaltados.

## 2. Personalizar Textos en el Inicio

Si quieres cambiar los mensajes de bienvenida o las descripciones de la página principal:

- Abre `app/page.tsx`.
- Busca los textos dentro de las etiquetas <h1>, <h2> o <p>.
- Simplemente reemplaza el texto entre las etiquetas y guarda el archivo.

## 3. Gestionar Productos y Categorías

No necesitas tocar el código para esto. Utiliza el panel administrativo:

1. Ve a `/admin/login`.
2. Entra con las credenciales por defecto (Configuradas en el seed o variables de entorno).
3. En la sección **Productos**, puedes añadir, editar o desactivar productos.
4. Para las fotos, el sistema utiliza **Cloudinary**. Asegúrate de tener tus credenciales en el archivo `.env`.

## 4. Configurar tu número de WhatsApp

Para que los pedidos lleguen a tu teléfono:

- Abre el archivo `.env`.
- Busca la variable `NEXT_PUBLIC_WHATSAPP_NUMBER`.
- Cambia el número por el tuyo (incluyendo el código de país, sin el símbolo +).
  - _Ejemplo:_ `18091234567`

## 5. Cambiar el Logo y Favicon

- El logo principal se encuentra en `components/layout/Header.tsx` y `Footer.tsx` (representado actualmente por un icono de aguacate `AvocadoIcon`).
- Puedes reemplazar ese componente por una etiqueta `<img>` con la ruta a tu logo.
- Para el **Favicon** (el icono de la pestaña del navegador), reemplaza el archivo `app/favicon.ico` por el tuyo.

## 6. Personalizar la Página "Nosotros"

- Ve a `app/nosotros/page.tsx`.
- Aquí encontrarás secciones de "Misión", "Visión" e "Historia".
- Modifica los textos para que cuenten la historia de tu propio emprendimiento.

---

## 🛠 Tips para Novatos

- **No borres las llaves `{}`**: En archivos `.tsx`, el código dentro de llaves es lógica. Si solo quieres cambiar texto, asegúrate de no borrar las llaves que lo envuelven.
- **Guarda para ver cambios**: Si estás ejecutando `npm run dev`, los cambios se verán en tiempo real en tu navegador al guardar el archivo.
- **Cuidado con el archivo `.env`**: Es el archivo más importante. Si borras algo ahí, las imágenes o los pagos podrían dejar de funcionar.
