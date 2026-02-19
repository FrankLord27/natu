# 🛠 Guía de Desarrollo Técnico

Esta guía está dirigida a desarrolladores que deseen expandir las funcionalidades de NaturaJM V3 o realizar un mantenimiento técnico profundo.

## ⚙️ Configuración del Entorno de Desarrollo

### 1. Requisitos

- Node.js 18+
- PostgreSQL
- Cuenta en Cloudinary (para gestión de imágenes)
- Cuentas de Sandbox en PayPal y Stripe (para pruebas de pago)

### 2. Flujo de Trabajo con Prisma

Cuando modifiques el archivo `prisma/schema.prisma`:

1. Ejecuta `npx prisma generate` para actualizar el cliente de TypeScript.
2. Ejecuta `npx prisma migrate dev --name <nombre_descriptivo>` para aplicar los cambios a la base de datos de desarrollo.
3. Si solo quieres sincronizar sin crear una migración formal, usa `npx prisma db push`.

## 📡 Desarrollo de APIs (Next.js API Routes)

- Las rutas se encuentran en `app/api/`.
- Cada ruta debe manejar errores correctamente y devolver JSON con un formato consistente (ej: `{ success: boolean, data?: any, error?: string }`).
- Para rutas protegidas, usa `getServerSession(authOptions)` para verificar si el usuario es administrador.

## 🚀 Server Actions (`lib/actions.ts`)

Preferimos el uso de **Server Actions** sobre API Routes para operaciones que se disparan desde formularios o botones directos, ya que facilitan la revalidación de caché de Next.js (`revalidatePath`).

## 🎨 Estilos y UI

- **Styled Components**: Usamos el `ThemeProvider` definido en `lib/registry.tsx` que toma los valores de `styles/theme.ts`.
- **SCSS**: Reservado para estilos globales, animaciones complejas y variables de utilidad.
- **Iconos**: Siempre usa `lucide-react` para mantener una estética minimalista y profesional.

## 🧪 Pruebas y Calidad de Código

- **TypeScript**: No uses `any` a menos que sea estrictamente necesario. Define interfaces en `types/index.ts`.
- **ESLint**: Ejecuta `npm run lint` periódicamente para asegurar el cumplimiento de las reglas de estilo.
- **Build**: Comprueba que el proyecto compila correctamente con `npm run build` antes de realizar un push a producción.

## 📦 Despliegue en Vercel

1. Conecta tu repositorio de GitHub a Vercel.
2. Configura todas las variables de entorno del archivo `.env.example`.
3. Asegúrate de que el comando de build sea `next build`.
4. El comando de install es `npm install`.

---

## 📈 Mejores Prácticas recomendadas para este proyecto

1. **Validación de Datos**: Usa `zod` para validar los datos que entran por formularios o APIs.
2. **Optimización de Imágenes**: Siempre utiliza el componente `<Image />` de Next.js para aprovechar la optimización automática.
3. **Manejo de Errores**: Nunca falles silenciosamente. Siempre muestra un mensaje amigable al usuario y registra el error técnico en la consola del servidor.
