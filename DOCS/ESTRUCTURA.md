# 📂 Estructura del Proyecto NaturaJM V3

Esta sección explica la organización de carpetas y archivos para facilitar la navegación a nuevos desarrolladores.

## 🏗 Arquitectura de Carpetas

### `app/` (Directorio Principal - App Router)

El corazón de la aplicación utilizando las convenciones de Next.js 14.

- `api/`: Contiene todos los endpoints de la API (Auth, Productos, Categorías, Analytics, etc.).
- `admin/`: Rutas protegidas para el panel de administración.
- `tienda/`: Lógica y vista del catálogo de productos.
- `productos/[slug]/`: Página dinámica de detalle de producto.
- `checkout/`: Proceso de pago unificado (WhatsApp, PayPal, Stripe).
- `contacto/` y `nosotros/`: Páginas informativas.
- `layout.tsx`: Layout raíz que inyecta los Providers (Cart, Wishlist, Auth).
- `globals.scss`: Estilos globales y reseteo CSS.

### `components/` (Componentes Reutilizables)

Organizados por dominio funcional:

- `layout/`: Componentes globales como el Header, Footer y el botón de WhatsApp.
- `cart/`: Drawer y lógica visual del carrito de compras.
- `products/`: Cards de producto y componentes de visualización.
- `ui/`: Componentes básicos reutilizables (Botones, Modales, Inputs).
- `providers/`: Envoltorios de contexto (AuthProvider).

### `context/` (Manejo de Estado Global)

Utiliza la API de Context de React para estados que persisten en toda la app:

- `CartContext.tsx`: Toda la lógica del carrito de compras.
- `WishlistContext.tsx`: Manejo de productos favoritos.
- `OrderContext.tsx`: Registro local de pedidos realizados.

### `lib/` (Utilidades y Lógica de Servidor)

- `actions.ts`: **Server Actions** para CRUD de productos y categorías (la lógica principal de negocio).
- `prisma.ts`: Cliente singleton de Prisma para interactuar con PostgreSQL.
- `auth.ts`: Configuración detallada de NextAuth.js.
- `cloudinary.ts`: Configuración para la subida de imágenes.
- `registry.tsx`: Configuración técnica para SSR con styled-components.

### `prisma/` (Base de Datos)

- `schema.prisma`: Definición del modelo de datos unificado.
- `seed.ts`: Datos iniciales para poblar la base de datos en desarrollo.

### `styles/` (Diseño y Estética)

- `theme.ts`: Tokens de diseño (colores, sombras, breakpoints) para styled-components.
- `variables.scss`: Variables SCSS compartidas.

### `types/` (Tipado TypeScript)

- `index.ts`: Interfaces y tipos globales para asegurar que el código sea robusto.

---

## 📄 Archivos Clave en la Raíz

- `.env`: Variables de entorno sensibles (¡Nunca subir a Git!).
- `.env.example`: Plantilla de las variables necesarias.
- `middleware.ts`: Control de acceso y protección de rutas administrativas.
- `next.config.mjs`: Configuración del servidor Next.js y dominios de imágenes permitidos.
- `package.json`: Listado de dependencias y scripts de ejecución.
