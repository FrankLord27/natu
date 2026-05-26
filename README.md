<div align="center">

# 🌿 NaturaJM — E-commerce V3

**Plataforma e-commerce completa para productos naturales y orgánicos**

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Styled Components](https://img.shields.io/badge/Styled--Components-6.3-DB7093?style=for-the-badge&logo=styled-components&logoColor=white)](https://styled-components.com/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[Demo en Vivo](#) · [Documentación](#-tabla-de-contenidos) · [Instalación](#-instalación-rápida) · [Contribuir](#-contribuir)

</div>

---

## 📋 Tabla de Contenidos

- [Descripción](#-descripción)
- [Funcionalidades del Sistema](#-funcionalidades-del-sistema)
- [Arquitectura](#-arquitectura)
- [Stack Tecnológico](#-stack-tecnológico)
- [Diagrama Entidad-Relación](#-diagrama-entidad-relación)
- [Flujo de Compra](#-flujo-de-compra)
- [Flujo de Autenticación](#-flujo-de-autenticación)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [API Reference](#-api-reference)
- [Instalación Rápida](#-instalación-rápida)
- [Variables de Entorno](#-variables-de-entorno)
- [Seed de Base de Datos](#-seed-de-base-de-datos)
- [Despliegue](#-despliegue)
- [Contribuir](#-contribuir)
- [Licencia](#-licencia)

---

## 🌿 Descripción

**NaturaJM V3** es una plataforma e-commerce de nueva generación para productos naturales, construida con Next.js 14, PostgreSQL y un sistema de triple checkout (WhatsApp, PayPal, Stripe). Fusiona las mejores funcionalidades de dos versiones anteriores en una única aplicación unificada y escalable.

### ¿Por qué V3?

| Versión   | Base de Datos  |             Pagos              |    Admin     | Reseñas | Newsletter |  Analytics   |
| --------- | :------------: | :----------------------------: | :----------: | :-----: | :--------: | :----------: |
| V1        |   PostgreSQL   |       WhatsApp + PayPal        |    Básico    |   ❌    |     ❌     |    Básico    |
| V2        |     SQLite     |             Stripe             |   Completo   |   ✅    |     ✅     |   Completo   |
| **V3** ✨ | **PostgreSQL** | **WhatsApp + PayPal + Stripe** | **Completo** | **✅**  |   **✅**   | **Completo** |

---

## ✨ Funcionalidades del Sistema

### 🏠 Página de Inicio (`/`)

| Sección                        | Funcionalidad                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------ |
| **Hero Banner**                | Banner principal animado con CTA hacia la tienda                                     |
| **Sección de Características** | 3 tarjetas con íconos: productos orgánicos, envío seguro, soporte WhatsApp           |
| **Categorías Destacadas**      | Grid visual de categorías con imágenes y navegación directa a `/tienda?category=...` |
| **Productos Destacados**       | Últimos 8 productos con `ProductCard` interactivos (agregar carrito + wishlist)      |
| **Videos**                     | Sección de videos informativos cargados desde la API                                 |
| **Testimonios**                | Carousel de testimonios reales de clientes (desde BD) con rating de estrellas        |
| **Newsletter**                 | Formulario de suscripción conectado a `/api/newsletter`                              |
| **CTA Final**                  | Llamada a la acción para visitar la tienda                                           |
| **Trust Badges**               | Indicadores de confianza (envío seguro, pago protegido, garantía, soporte)           |

---

### 🛒 Tienda (`/tienda`)

| Funcionalidad               | Descripción                                                                  |
| --------------------------- | ---------------------------------------------------------------------------- |
| **Búsqueda en tiempo real** | Input con debounce de 300ms, busca por nombre de producto                    |
| **Filtro por categoría**    | Tabs interactivos mostrando todas las categorías con conteo de productos     |
| **Ordenamiento**            | 4 opciones: más recientes, precio ascendente/descendente, mejor valorados    |
| **URL Params**              | Soporte para `?category=Aceites` — precarga el filtro desde enlaces externos |
| **Skeleton Loading**        | Placeholders animados mientras cargan los productos                          |
| **Estado vacío**            | Mensaje amigable cuando no hay resultados                                    |
| **Contador de resultados**  | Muestra cantidad de productos encontrados                                    |
| **Grid responsivo**         | Se adapta de 1 a 4 columnas según el ancho de pantalla                       |

---

### 📦 Detalle de Producto (`/productos/[slug]`)

| Funcionalidad             | Descripción                                                    |
| ------------------------- | -------------------------------------------------------------- |
| **Galería de imágenes**   | Imagen principal con zoom on hover + thumbnails seleccionables |
| **Breadcrumbs**           | Navegación contextual: Inicio > Tienda > Producto              |
| **Etiqueta de categoría** | Badge con nombre de la categoría del producto                  |
| **Precios**               | Precio actual, precio original tachado, badge de descuento (%) |
| **Rating con estrellas**  | Estrellas visuales + promedio numérico + conteo de reseñas     |
| **Selector de cantidad**  | Botones +/- con mínimo de 1                                    |
| **Agregar al carrito**    | Botón principal, agrega la cantidad seleccionada               |
| **Agregar a wishlist**    | Botón corazón con toggle visual (rojo = agregado)              |
| **Trust badges**          | Envío seguro, pago protegido, garantía NaturaJM                |
| **Tabs de contenido**     | 4 pestañas: Descripción, Ingredientes, Modo de Uso, Reseñas    |
| **Reseñas de usuarios**   | Cards con rating, título, contenido y nombre del usuario       |

---

### 💳 Checkout (`/checkout`)

| Funcionalidad                  | Descripción                                                          |
| ------------------------------ | -------------------------------------------------------------------- |
| **Resumen del pedido**         | Lista de productos con imagen, nombre, cantidad y subtotal           |
| **Total calculado**            | Suma automática de todos los items                                   |
| **Selector de método de pago** | 3 opciones con íconos y descripción                                  |
| **WhatsApp Checkout**          | Genera mensaje formateado con todos los productos y abre WhatsApp    |
| **PayPal**                     | Integración con PayPal SDK (configurable vía env)                    |
| **Stripe**                     | Pago con tarjeta de crédito/débito vía Stripe (configurable vía env) |
| **Registro de orden**          | Cada compra se guarda en el historial del usuario                    |
| **Estado vacío**               | Redirect a tienda si el carrito está vacío                           |

```mermaid
graph LR
    subgraph Pagos["Metodos de Pago Integrados"]
        WA["WhatsApp<br/>Envio directo del pedido<br/>al vendedor por chat"]
        PP["PayPal<br/>Pago seguro<br/>con cuenta PayPal"]
        ST["Stripe<br/>Visa - Mastercard - AMEX<br/>Debito y credito"]
    end

    style WA fill:#dcf8c6,stroke:#25D366,stroke-width:2px
    style PP fill:#d4e3f5,stroke:#003087,stroke-width:2px
    style ST fill:#ede7f6,stroke:#635BFF,stroke-width:2px
```

---

### 📞 Contacto (`/contacto`)

| Funcionalidad        | Descripción                                   |
| -------------------- | --------------------------------------------- |
| **Formulario**       | Campos: nombre, email, mensaje con validación |
| **Envío a API**      | POST a `/api/contact` que almacena en BD      |
| **Estado de éxito**  | Animación de confirmación tras envío exitoso  |
| **Info de contacto** | Tarjetas con teléfono, email y ubicación      |
| **Enlace WhatsApp**  | Botón directo para abrir chat de WhatsApp     |

---

### 🌿 Nosotros (`/nosotros`)

| Funcionalidad        | Descripción                                                               |
| -------------------- | ------------------------------------------------------------------------- |
| **Hero animado**     | Título y descripción con animación de entrada (Framer Motion)             |
| **Valores**          | 3 tarjetas: Naturaleza Pura, Pasión por el Bienestar, Calidad Certificada |
| **Nuestra Historia** | Sección split con contenido y visual V3 branding                          |
| **Estadísticas**     | Contadores animados: 500+ productos, 10K+ clientes, 100% natural, 5★      |

---

### 🛒 Sistema de Carrito

```mermaid
stateDiagram-v2
    [*] --> Vacio
    Vacio --> ConItems: Agregar producto
    ConItems --> ConItems: Modificar cantidad
    ConItems --> ConItems: Agregar otro producto
    ConItems --> Vacio: Eliminar todos
    ConItems --> Checkout: Finalizar compra
    Checkout --> WhatsApp: Metodo WhatsApp
    Checkout --> PayPal: Metodo PayPal
    Checkout --> Stripe: Metodo Stripe
    WhatsApp --> OrdenGuardada
    PayPal --> OrdenGuardada
    Stripe --> OrdenGuardada
    OrdenGuardada --> [*]
```

| Componente               | Funcionalidad                                                                         |
| ------------------------ | ------------------------------------------------------------------------------------- |
| **CartContext**          | Estado global: items, cantidades, total. Persistencia en `localStorage`               |
| **CartDrawer**           | Panel lateral animado con lista de items, +/-, eliminar, total, y botones de checkout |
| **Badge en Header**      | Contador visual de items en el carrito                                                |
| **Checkout WhatsApp**    | Genera mensaje formateado y abre `wa.me`                                              |
| **Checkout Card/PayPal** | Redirige a `/checkout` para completar el pago                                         |

---

### 💜 Sistema de Wishlist

| Componente                | Funcionalidad                                                 |
| ------------------------- | ------------------------------------------------------------- |
| **WishlistContext**       | Estado global de favoritos. Persistencia en `localStorage`    |
| **WishlistModal**         | Modal con grid de productos favoritos, botón mover al carrito |
| **Toggle en ProductCard** | Corazón interactivo para agregar/quitar de wishlist           |
| **Badge en Header**       | Contador visual de items en la wishlist                       |

---

### 📜 Sistema de Pedidos

| Componente              | Funcionalidad                                                    |
| ----------------------- | ---------------------------------------------------------------- |
| **OrderContext**        | Registro de pedidos realizados. Persistencia en `localStorage`   |
| **OrderHistoryModal**   | Modal con historial: fecha, items, total, método de pago, estado |
| **Registro automático** | Cada checkout crea una entrada de orden con método de pago usado |

---

### 🔐 Panel Administrativo (`/admin`)

```mermaid
graph TD
    LOGIN["Login<br/>bcrypt + NextAuth"] --> DASH["Dashboard<br/>Metricas en tiempo real"]
    DASH --> PROD["Productos<br/>CRUD completo"]
    DASH --> CAT["Categorias<br/>Gestion"]
    DASH --> USR["Usuarios<br/>Gestion"]
    DASH --> TEST["Testimonios<br/>CRUD"]
    DASH --> VID["Videos<br/>CRUD"]
    DASH --> MSG["Mensajes<br/>Bandeja de contacto"]
    DASH --> NEWS["Newsletter<br/>Suscriptores"]
    DASH --> MET["Metricas<br/>Analytics avanzados"]
    DASH --> SET["Ajustes<br/>Configuracion"]
```

#### Dashboard (`/admin`)

| Funcionalidad            | Descripción                                                                   |
| ------------------------ | ----------------------------------------------------------------------------- |
| **Stat Cards**           | 4 tarjetas: Productos, Usuarios, Visitas, Mensajes (con gradientes de color)  |
| **Resumen rápido**       | Suscriptores newsletter, testimonios, pedidos                                 |
| **Acciones rápidas**     | Links directos: agregar producto, ver mensajes, gestionar contenido, métricas |
| **Datos en tiempo real** | Consumo de `/api/admin/stats` con conteos directos de la BD                   |

#### Productos (`/admin/productos`)

| Funcionalidad          | Descripción                                                                                                                    |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| **Tabla de productos** | Columnas: imagen, nombre, categoría, precio, estado, acciones                                                                  |
| **Búsqueda**           | Filtrado por nombre en tiempo real                                                                                             |
| **Crear producto**     | Modal con campos: nombre, descripción, precio, descuento, stock, categoría, marca, ingredientes, modo de uso, URLs de imágenes |
| **Editar producto**    | Mismo modal precargado con datos existentes                                                                                    |
| **Eliminar producto**  | Confirmación antes de borrar                                                                                                   |
| **Toggle visibilidad** | Activar/desactivar producto sin eliminarlo                                                                                     |
| **Status badge**       | Visual de estado Activo (verde) / Inactivo (rojo)                                                                              |

#### Login (`/admin/login`)

| Funcionalidad      | Descripción                                           |
| ------------------ | ----------------------------------------------------- |
| **Formulario**     | Email + contraseña con toggle de visibilidad          |
| **Autenticación**  | NextAuth con CredentialsProvider + bcrypt             |
| **Error handling** | Mensaje de error visual para credenciales incorrectas |
| **Redirect**       | Redirige a `/admin` tras login exitoso                |

---

### 🔒 Seguridad

| Capa                       | Implementación                                                   |
| -------------------------- | ---------------------------------------------------------------- |
| **Hashing de contraseñas** | bcrypt con salt rounds de 10                                     |
| **Sesiones**               | JWT tokens vía NextAuth.js                                       |
| **Protección de rutas**    | Middleware intercepta todas las rutas `/admin/*`                 |
| **Control de roles**       | Verificación de `ADMIN` o `SUPERADMIN` en JWT payload            |
| **Variables sensibles**    | Credenciales de pago y BD en variables de entorno (no en código) |
| **CORS**                   | Configurado por Next.js API Routes                               |

---

### 📱 Componentes Globales

| Componente            | Funcionalidad                                                                                                 |
| --------------------- | ------------------------------------------------------------------------------------------------------------- |
| **Header**            | Logo, navegación (Inicio, Tienda, Nosotros, Contacto), badges de carrito/wishlist/pedidos con modales         |
| **Footer**            | Logo, links de navegación, links de pago, contacto (email, teléfono, ubicación), redes sociales, copyright V3 |
| **WhatsApp Button**   | Botón flotante fijo en esquina inferior derecha con animación pulse. Abre chat directo                        |
| **CartDrawer**        | Panel lateral derecho animado (slide-in) con overlay oscuro                                                   |
| **WishlistModal**     | Modal centrado para gestionar favoritos                                                                       |
| **OrderHistoryModal** | Modal con scroll interno para ver historial de pedidos                                                        |
| **ProductCard**       | Card con imagen, categoría, nombre, rating, precio, descuento, botones carrito + wishlist                     |
| **AuthProvider**      | Wrapper de NextAuth SessionProvider para toda la app                                                          |

---

### 📊 Sistema de Analytics

| Evento                 | Tracking                                         | Almacenamiento                           |
| ---------------------- | ------------------------------------------------ | ---------------------------------------- |
| **Vista de producto**  | Se registra cada visita a un detalle de producto | `Analytics` tabla, tipo `VIEW`           |
| **Click en WhatsApp**  | Cada apertura de WhatsApp desde un producto      | `Analytics` tabla, tipo `WHATSAPP_CLICK` |
| **Agregar al carrito** | Cada vez que un producto se agrega al carrito    | `Analytics` tabla, tipo `ADD_TO_CART`    |
| **Compra**             | Cada checkout completado                         | `Analytics` tabla, tipo `PURCHASE`       |
| **Click general**      | Interacciones medidas                            | `Analytics` tabla, tipo `CLICK`          |

---

### 🎨 Sistema de Diseño

| Token             | Valor                                               | Uso                       |
| ----------------- | --------------------------------------------------- | ------------------------- |
| **Primary**       | `#7BB32E`                                           | Botones, enlaces, acentos |
| **Primary Dark**  | `#5D8522`                                           | Hover states, gradientes  |
| **Primary Pale**  | `#f0f7e6`                                           | Backgrounds sutiles       |
| **Accent**        | `#FF6B35`                                           | Descuentos, alertas       |
| **Text**          | `#2D3436`                                           | Texto principal           |
| **Text Light**    | `#636E72`                                           | Texto secundario          |
| **Border Radius** | `sm: 8px, md: 14px, lg: 20px, xl: 24px, full: 50px` | Esquinas redondeadas      |
| **Shadows**       | `sm`, `md`, `lg`, `xl`                              | Elevación de cards        |
| **Breakpoints**   | `sm: 576px, md: 768px, lg: 992px, xl: 1200px`       | Responsive design         |
| **Animaciones**   | `fadeIn`, `slideUp`, `pulse`                        | Transiciones globales     |

---

## 🏗 Arquitectura

```mermaid
graph TB
    subgraph Cliente["Cliente - Browser"]
        UI["React Components<br/>styled-components"]
        CTX["Contexts<br/>Cart - Wishlist - Orders"]
        NAV["Next.js Router<br/>App Router"]
    end

    subgraph NextJS["Next.js 14 Server"]
        Pages["Pages SSR/SSG"]
        API["API Routes<br/>/api/*"]
        MW["Middleware<br/>Role-Based Auth"]
        Actions["Server Actions<br/>lib/actions.ts"]
        Auth["NextAuth.js<br/>JWT + bcrypt"]
    end

    subgraph Servicios["Servicios Externos"]
        DB[("PostgreSQL<br/>Prisma ORM")]
        Cloud["Cloudinary<br/>Image CDN"]
        WA["WhatsApp<br/>Business API"]
        PP["PayPal<br/>SDK"]
        ST["Stripe<br/>API"]
    end

    UI --> CTX
    UI --> NAV
    NAV --> Pages
    NAV --> API
    API --> MW
    MW --> Auth
    Pages --> Actions
    Actions --> DB
    API --> DB
    API --> Cloud
    API --> WA
    API --> PP
    API --> ST

    style Cliente fill:#e8f5e9,stroke:#7BB32E,stroke-width:2px
    style NextJS fill:#f3e5f5,stroke:#9c27b0,stroke-width:2px
    style Servicios fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
```

---

## 🔧 Stack Tecnológico

| Capa              | Tecnología               | Propósito                          |
| ----------------- | ------------------------ | ---------------------------------- |
| **Frontend**      | Next.js 14 (App Router)  | Framework fullstack SSR/SSG        |
| **Estilos**       | styled-components + SCSS | Component-scoped + global styles   |
| **Animaciones**   | Framer Motion            | Micro-interacciones y transiciones |
| **Iconos**        | Lucide React             | Iconografía consistente            |
| **Estado**        | React Context            | Cart, Wishlist, Orders             |
| **Base de Datos** | PostgreSQL               | Base de datos relacional           |
| **ORM**           | Prisma 7.0               | Type-safe database access          |
| **Autenticación** | NextAuth.js + bcrypt     | JWT sessions, role-based           |
| **Imágenes**      | Cloudinary               | Upload, optimización y CDN         |
| **Pagos**         | PayPal SDK + Stripe      | Procesamiento de pagos             |
| **Forms**         | React Hook Form + Zod    | Validación de formularios          |
| **Charts**        | Recharts                 | Gráficos del dashboard admin       |
| **Lenguaje**      | TypeScript 5             | Type safety end-to-end             |

---

## 📊 Diagrama Entidad-Relación

```mermaid
erDiagram
    Product ||--o{ Review : "tiene"
    Product ||--o{ Favorite : "tiene"
    Product ||--o{ OrderItem : "aparece en"
    Product ||--o{ Analytics : "registra"
    Product }o--|| Category : "pertenece a"

    User ||--o{ Review : "escribe"
    User ||--o{ Favorite : "guarda"
    User ||--o{ Order : "realiza"

    Order ||--|{ OrderItem : "contiene"

    Product {
        string id PK
        string name
        string slug UK
        string description
        float price
        float discountPrice
        string imageUrls
        int stock
        boolean isActive
        string brand
        string sku UK
        string weight
        string dimensions
        string ingredients
        string howToUse
        string warnings
        float averageRating
        int reviewCount
        string categoryId FK
    }

    Category {
        string id PK
        string name UK
        string slug UK
        string description
        string icon
        string imageUrl
    }

    User {
        string id PK
        string email UK
        string name
        string passwordHash
        string phone
        string avatarUrl
    }

    AdminUser {
        string id PK
        string email UK
        string name
        string passwordHash
        string role
    }

    Order {
        string id PK
        string userId FK
        string customerEmail
        string customerName
        float total
        string status
        string paymentMethod
        string paymentId
    }

    OrderItem {
        string id PK
        string orderId FK
        string productId FK
        int quantity
        float price
    }

    Review {
        string id PK
        int rating
        string title
        string content
        string userId FK
        string productId FK
    }

    Favorite {
        string id PK
        string userId FK
        string productId FK
    }

    Analytics {
        string id PK
        string productId FK
        string type
        string metadata
        datetime timestamp
    }

    ContactSubmission {
        string id PK
        string name
        string email
        string message
        boolean responded
    }

    NewsletterSubscription {
        string id PK
        string email UK
        boolean isActive
    }

    Testimonial {
        string id PK
        string name
        string content
        int rating
        boolean isActive
        int order
    }

    Video {
        string id PK
        string title
        string url
        string description
        boolean isActive
        int order
    }

    SiteContent {
        string id PK
        string key UK
        json value
    }
```

---

## 🛒 Flujo de Compra

```mermaid
flowchart TD
    A["Usuario visita la tienda"] --> B["Busca y filtra productos"]
    B --> C["Ve detalle del producto"]
    C --> D{"Agregar al carrito?"}
    D -->|Si| E["Producto en carrito"]
    D -->|No| B
    D -->|Wishlist| W["Agregar a wishlist"]
    W --> B

    E --> F["Ver carrito - drawer"]
    F --> G{"Finalizar compra?"}
    G -->|No| B
    G -->|Si| H["Pagina de Checkout"]

    H --> I{"Metodo de pago"}

    I -->|WhatsApp| J["Genera mensaje WhatsApp"]
    J --> J1["Abre WhatsApp con pedido"]
    J1 --> K["Orden guardada"]

    I -->|PayPal| L["Redirige a PayPal"]
    L --> L1["Pago confirmado"]
    L1 --> K

    I -->|Stripe| M["Formulario de tarjeta"]
    M --> M1["Pago procesado"]
    M1 --> K

    K --> N["Confirmacion de pedido"]
    N --> O["Historial de pedidos"]

    style A fill:#e8f5e9,stroke:#7BB32E
    style K fill:#e8f5e9,stroke:#7BB32E
    style N fill:#c8e6c9,stroke:#2e7d32
    style J1 fill:#dcf8c6,stroke:#25D366
    style L1 fill:#d4e3f5,stroke:#003087
    style M1 fill:#ede7f6,stroke:#635BFF
```

---

## 🔐 Flujo de Autenticación

```mermaid
sequenceDiagram
    actor Admin
    participant Login as Login Page
    participant NextAuth as NextAuth.js
    participant MW as Middleware
    participant DB as PostgreSQL
    participant Panel as Admin Panel

    Admin->>Login: Ingresa email + password
    Login->>NextAuth: POST /api/auth/signin
    NextAuth->>DB: Buscar AdminUser por email
    DB-->>NextAuth: AdminUser encontrado

    alt Credenciales validas
        NextAuth->>NextAuth: bcrypt.compare password hash
        NextAuth-->>Login: JWT Token con role
        Login->>Panel: Redirect /admin
        Panel->>MW: Request /admin/*
        MW->>MW: Verificar JWT + role
        alt ADMIN o SUPERADMIN
            MW-->>Panel: Acceso permitido
        else Sin autorizacion
            MW-->>Login: Redirect /admin/login
        end
    else Credenciales invalidas
        NextAuth-->>Login: Error Credenciales incorrectas
    end
```

---

## 📁 Estructura del Proyecto

```
naturajm/
├── app/
│   ├── layout.tsx                    # Root layout (providers, header, footer)
│   ├── page.tsx                      # Home page
│   ├── tienda/
│   │   └── page.tsx                  # Catalogo con filtros
│   ├── productos/
│   │   └── [slug]/
│   │       └── page.tsx              # Detalle de producto
│   ├── checkout/
│   │   └── page.tsx                  # WhatsApp + PayPal + Stripe
│   ├── contacto/
│   │   └── page.tsx                  # Formulario de contacto
│   ├── nosotros/
│   │   └── page.tsx                  # Pagina informativa
│   ├── admin/
│   │   ├── layout.tsx                # Sidebar admin
│   │   ├── page.tsx                  # Dashboard
│   │   ├── login/
│   │   │   └── page.tsx              # Login admin
│   │   └── productos/
│   │       └── page.tsx              # CRUD productos
│   └── api/
│       ├── auth/[...nextauth]/       # NextAuth endpoint
│       ├── products/                 # CRUD productos
│       ├── products/[id]/            # Producto por ID
│       ├── categories/               # Categorias
│       ├── contact/                  # Formulario contacto
│       ├── newsletter/               # Suscripciones
│       ├── testimonials/             # Testimonios
│       ├── videos/                   # Videos
│       ├── analytics/view/           # Analytics
│       ├── upload/                   # Cloudinary upload
│       └── admin/stats/              # Estadisticas admin
├── components/
│   ├── layout/                       # Header, Footer, WhatsAppButton
│   ├── cart/                         # CartDrawer
│   ├── wishlist/                     # WishlistModal
│   ├── orders/                       # OrderHistoryModal
│   ├── products/                     # ProductCard
│   └── providers/                    # AuthProvider
├── context/                          # CartContext, OrderContext, WishlistContext
├── lib/                              # prisma, auth, actions, cloudinary, registry
├── styles/                           # theme.ts, globals.scss, variables.scss
├── types/                            # TypeScript types
├── prisma/
│   ├── schema.prisma                 # Schema de base de datos
│   └── seed.ts                       # Script de datos iniciales
├── middleware.ts                      # Proteccion de rutas admin
├── next.config.mjs                   # Configuracion Next.js
├── tsconfig.json                     # TypeScript config
└── package.json                      # Dependencias y scripts
```

---

## 📡 API Reference

### Productos

| Método   | Endpoint             | Descripción                                              | Auth |
| -------- | -------------------- | -------------------------------------------------------- | :--: |
| `GET`    | `/api/products`      | Listar productos (filtros: `search`, `category`, `sort`) |  ❌  |
| `POST`   | `/api/products`      | Crear producto                                           |  ✅  |
| `GET`    | `/api/products/[id]` | Obtener producto por ID                                  |  ❌  |
| `PUT`    | `/api/products/[id]` | Actualizar producto                                      |  ✅  |
| `DELETE` | `/api/products/[id]` | Eliminar producto                                        |  ✅  |

### Categorías

| Método | Endpoint          | Descripción                               | Auth |
| ------ | ----------------- | ----------------------------------------- | :--: |
| `GET`  | `/api/categories` | Listar categorías con conteo de productos |  ❌  |

### Contacto y Newsletter

| Método | Endpoint          | Descripción                | Auth |
| ------ | ----------------- | -------------------------- | :--: |
| `POST` | `/api/contact`    | Enviar mensaje de contacto |  ❌  |
| `POST` | `/api/newsletter` | Suscribirse al newsletter  |  ❌  |

### Contenido

| Método | Endpoint            | Descripción                | Auth |
| ------ | ------------------- | -------------------------- | :--: |
| `GET`  | `/api/testimonials` | Listar testimonios activos |  ❌  |
| `POST` | `/api/testimonials` | Crear testimonio           |  ✅  |
| `GET`  | `/api/videos`       | Listar videos activos      |  ❌  |
| `POST` | `/api/videos`       | Crear video                |  ✅  |

### Analytics y Admin

| Método | Endpoint              | Descripción                 | Auth |
| ------ | --------------------- | --------------------------- | :--: |
| `POST` | `/api/analytics/view` | Registrar vista de producto |  ❌  |
| `POST` | `/api/upload`         | Subir imagen a Cloudinary   |  ✅  |
| `GET`  | `/api/admin/stats`    | Dashboard estadísticas      |  ✅  |

---

## 🚀 Instalación Rápida

### Prerrequisitos

- **Node.js** >= 18.17
- **PostgreSQL** >= 14
- **npm** >= 9.0
- **MinIO** (local vía Docker o instancia externa) — para subida de imágenes

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/FrankLord27/naturajm_ecommer.git
cd naturajm_ecommer

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales (ver sección siguiente)

# 4. Sincronizar el schema con la base de datos
npm run db:push

# 5. Poblar con datos de ejemplo
npm run db:seed

# 6. Iniciar servidor de desarrollo
npm run dev
```

> **Nota:** `npm install` ejecuta automáticamente `prisma generate` via el hook `postinstall`.

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### MinIO local (almacenamiento de imágenes)

```bash
# Levantar MinIO con Docker
docker compose -f docker-compose-minio.yml up -d

# Consola web disponible en http://localhost:9005
# Usuario: minioadmin  /  Contraseña: minioadminpassword
```

---

## 🔑 Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```env
# ── Base de Datos ──────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/naturajm?schema=public"

# ── NextAuth ───────────────────────────────────────────────────
# Generar con: openssl rand -base64 32
NEXTAUTH_SECRET="tu-clave-secreta-super-segura"
NEXTAUTH_URL="http://localhost:3000"           # En prod: https://tu-dominio.com

# ── Cloudinary (Imágenes CDN) ──────────────────────────────────
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# ── MinIO (Storage local de archivos) ─────────────────────────
MINIO_ENDPOINT="localhost"
MINIO_PORT="9004"
MINIO_USE_SSL="false"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadminpassword"
MINIO_BUCKET_NAME="naturajm-assets"

# ── Resend (Emails transaccionales) ───────────────────────────
RESEND_API_KEY="re_..."

# ── PayPal ─────────────────────────────────────────────────────
NEXT_PUBLIC_PAYPAL_CLIENT_ID="tu-paypal-client-id"
PAYPAL_CLIENT_SECRET="tu-paypal-secret"

# ── Stripe ─────────────────────────────────────────────────────
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."

# ── WhatsApp ───────────────────────────────────────────────────
NEXT_PUBLIC_WHATSAPP_NUMBER="18091234567"

# ── App ────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"   # En prod: https://tu-dominio.com
```

> **Producción:** `NEXTAUTH_URL` y `NEXT_PUBLIC_APP_URL` deben apuntar a tu dominio real con HTTPS.  
> `NEXTAUTH_SECRET` debe ser un valor aleatorio seguro (`openssl rand -base64 32`).

---

## 🌱 Seed de Base de Datos

El seed script crea datos iniciales para desarrollo:

| Entidad     | Cantidad | Detalles                                  |
| ----------- | :------: | ----------------------------------------- |
| Admin User  |    1     | `admin@naturajm.com` / `admin123`         |
| Categorías  |    4     | Aceites, Harinas, Cosméticos, Suplementos |
| Productos   |    10    | Con imágenes, descripciones, precios      |
| Testimonios |    5     | Con ratings de 4-5 estrellas              |
| Videos      |    2     | Enlaces de ejemplo                        |

```bash
# Ejecutar seed
npm run db:seed

# Abrir Prisma Studio (GUI de BD)
npm run db:studio
```

---

## 🧰 Scripts Disponibles

| Script        | Comando               | Descripción                                         |
| ------------- | --------------------- | --------------------------------------------------- |
| `dev`         | `npm run dev`         | Servidor de desarrollo                              |
| `build`       | `npm run build`       | `prisma generate` + build Next.js (sin tocar la BD) |
| `start`       | `npm run start`       | Iniciar servidor en producción                      |
| `lint`        | `npm run lint`        | Linter ESLint                                       |
| `db:generate` | `npm run db:generate` | Generar Prisma Client                               |
| `db:push`     | `npm run db:push`     | Sincronizar schema con la BD (desarrollo/prod)      |
| `db:migrate`  | `npm run db:migrate`  | Crear migración en desarrollo                       |
| `db:deploy`   | `npm run db:deploy`   | Aplicar migraciones en producción                   |
| `db:seed`     | `npm run db:seed`     | Poblar BD con datos de ejemplo                      |
| `db:studio`   | `npm run db:studio`   | GUI visual de base de datos                         |

---

## 🌐 Despliegue

> **Importante:** el script `build` solo ejecuta `prisma generate && next build`.
> La sincronización de la base de datos (`db:push`) debe correrse **una vez**, antes de iniciar la app, no en cada build.

### Flujo de deploy (cualquier plataforma)

```
1. npm install          → instala deps + genera Prisma Client (postinstall)
2. npm run build        → prisma generate + next build
3. npm run db:push      → sincroniza el schema con la BD  ← una sola vez / por cambio de schema
4. npm start            → inicia el servidor Next.js
```

---

### Vercel

1. Conecta el repositorio en [vercel.com](https://vercel.com).
2. Configura todas las variables de entorno en **Settings → Environment Variables**.
3. El build command por defecto (`npm run build`) es suficiente.
4. Corre `npm run db:push` manualmente desde tu máquina apuntando a la BD de producción antes del primer deploy (o usa Railway/Supabase con el CLI).

```bash
# Ejemplo: sincronizar schema desde local apuntando a prod
DATABASE_URL="postgresql://..." npm run db:push
```

---

### Railway / Render / Fly.io (VPS con Docker)

```dockerfile
# ── Build stage ──────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# ── Runner stage ─────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

> Para usar el output standalone, añade `output: 'standalone'` en `next.config.mjs`.

#### docker-compose completo (app + PostgreSQL + MinIO)

```yaml
services:
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: naturajm
      POSTGRES_USER: naturajm
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${MINIO_SECRET_KEY}
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    restart: unless-stopped

  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://naturajm:${POSTGRES_PASSWORD}@postgres:5432/naturajm
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET}
      NEXTAUTH_URL: ${NEXTAUTH_URL}
      MINIO_ENDPOINT: minio
      MINIO_PORT: "9000"
      # ... resto de variables
    depends_on:
      - postgres
      - minio
    restart: unless-stopped

volumes:
  postgres_data:
  minio_data:
```

---

### Checklist de producción

- [ ] `NEXTAUTH_SECRET` generado con `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` apunta al dominio real con HTTPS
- [ ] `NEXT_PUBLIC_APP_URL` apunta al dominio real con HTTPS
- [ ] `DATABASE_URL` apunta a la BD de producción
- [ ] `npm run db:push` corrido al menos una vez contra la BD de producción
- [ ] Credenciales de Stripe/PayPal son de **producción** (`pk_live_...` / `sk_live_...`)
- [ ] `RESEND_API_KEY` configurado y dominio verificado en Resend
- [ ] MinIO accesible públicamente (o usar Cloudinary exclusivamente para imágenes)
- [ ] Variables `MINIO_ACCESS_KEY` / `MINIO_SECRET_KEY` cambiadas (no usar `minioadmin`)
- [ ] Dominio de email en `lib/email.ts` actualizado (`onboarding@resend.dev` → tu dominio)

---

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

---

<div align="center">

Hecho con 💚 por **NaturaJM** · V3 Final

[Volver arriba](#-naturajm--e-commerce-v3)

</div>
