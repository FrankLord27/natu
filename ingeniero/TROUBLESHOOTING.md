# Troubleshooting Guide 🔧

Soluciones a problemas comunes durante el desarrollo de proyectos e-commerce.

## 🚨 Problemas Comunes y Soluciones

### 1. Prisma Issues

#### Error: "Can't reach database server"

**Síntomas:**

```
Error: P1001: Can't reach database server
```

**Causas:**

- Database no está corriendo
- CONNECTION_STRING incorrecto
- Firewall bloqueando

**Solución:**

```bash
# Verificar que PostgreSQL esté corriendo
brew services list  # Mac
sudo service postgresql status  # Linux

# Verificar CONNECTION_STRING
echo $DATABASE_URL

# Formato correcto:
# postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public

# Reiniciar Prisma
npx prisma generate
npx prisma db push
```

#### Error: "Migration failed"

**Solución:**

```bash
# Reset database (⚠️ CUIDADO: borra datos)
npx prisma migrate reset

# O crear nueva migración
npx prisma migrate dev --name fix_migration

# Si estás en producción, NO resetees
# En su lugar:
npx prisma migrate resolve --applied [migration_name]
```

#### Error: "Prisma Client is not generated"

**Solución:**

```bash
# Generar cliente
npx prisma generate

# Si persiste, reinstalar
npm uninstall @prisma/client
npm install @prisma/client
npx prisma generate
```

---

### 2. Next.js Issues

#### Error: "Module not found"

**Síntomas:**

```
Error: Cannot find module '@/components/...'
```

**Solución:**

```json
// Verificar tsconfig.json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"] // O ["./"] si no usas /src
    }
  }
}
```

```bash
# Limpiar cache
rm -rf .next
npm run dev
```

#### Error: "Hydration mismatch"

**Síntomas:**

```
Error: Hydration failed because the initial UI does not match
```

**Causas comunes:**

- styled-components sin configurar correctamente
- Contenido diferente en servidor vs cliente
- Problemas con dates/timestamps

**Solución para styled-components:**

```typescript
// next.config.js
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
```

```typescript
// pages/_document.tsx (si usas Pages Router)
import Document, { DocumentContext } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }
}
```

#### Error: "API Route not working"

**Checklist:**

```bash
# Verificar que el archivo esté en /app/api/
# Ejemplo: app/api/products/route.ts

# Formato correcto:
export async function GET(request: Request) {
  return Response.json({ data: 'hello' })
}

# NO:
export default function handler(req, res) { ... }  # Esto es Pages Router
```

---

### 3. TypeScript Errors

#### Error: "Type X is not assignable to Y"

**Solución:**

```typescript
// Definir types explícitamente
import { Product } from "@/types/product";

// Asegurarse que el type es correcto
interface Product {
  id: string;
  name: string;
  price: number;
  // ... otros campos
}

// Si viene de API, validar con Zod
import { z } from "zod";

const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.number(),
});

const product = ProductSchema.parse(apiData);
```

#### Error: "Property does not exist on type"

**Solución:**

```typescript
// En vez de:
const value = obj.property; // Error si 'property' no está en el type

// Hacer:
const value = obj.property as string; // Type assertion
// O mejor:
const value = "property" in obj ? obj.property : undefined;
```

---

### 4. Styled-Components Issues

#### Estilos no aparecen

**Solución:**

```typescript
// 1. Asegúrate de tener el provider
// app/layout.tsx
'use client'
import { ThemeProvider } from 'styled-components'
import { theme } from '@/styles/theme'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ThemeProvider theme={theme}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// 2. Verificar next.config.js
module.exports = {
  compiler: {
    styledComponents: true,
  },
}
```

#### Theme no funciona

**Solución:**

```typescript
// Definir theme correctamente
export const theme = {
  colors: {
    primary: "#2E7D32",
  },
};

// Usar en componente
import styled from "styled-components";

const Button = styled.button`
  background: ${(props) => props.theme.colors.primary};
`;

// Asegurar que theme tiene los valores
console.log(theme.colors.primary); // Debe imprimir '#2E7D32'
```

---

### 5. Image Upload Issues (Cloudinary)

#### Error: "Upload failed"

**Solución:**

```typescript
// Verificar variables de entorno
console.log({
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_API_KEY,
  apiSecret: process.env.CLOUDINARY_API_SECRET,
});

// Si alguno es undefined, revisar .env

// Verificar configuración
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Test de upload
const result = await cloudinary.uploader.upload(filePath, {
  folder: "products",
});
console.log("Upload success:", result.secure_url);
```

#### Imágenes no cargan en producción

**Solución:**

```javascript
// next.config.js
module.exports = {
  images: {
    domains: ["res.cloudinary.com"],
  },
};
```

---

### 6. Authentication Issues (NextAuth)

#### Error: "Session is null"

**Solución:**

```typescript
// Verificar que el provider está configurado
// app/layout.tsx
import { SessionProvider } from 'next-auth/react'

export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}

// Verificar variables de entorno
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=tu-secret-super-seguro

// Generar secret si no tienes:
// openssl rand -base64 32
```

#### Login redirect no funciona

**Solución:**

```typescript
// lib/auth.ts
export const authOptions = {
  providers: [...],
  pages: {
    signIn: '/admin/login',  // Tu página de login
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // Siempre redirigir a /admin después de login
      return `${baseUrl}/admin`
    },
  },
}
```

---

### 7. Performance Issues

#### Página carga lenta

**Diagnóstico:**

```bash
# Ejecutar Lighthouse
npm run build
npm start
# Abrir Chrome DevTools > Lighthouse

# Identificar qué es lento:
# - Images? → Optimizar
# - JavaScript? → Code splitting
# - API calls? → Caching
```

**Soluciones:**

**Imágenes:**

```tsx
// Usar Next.js Image
import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={500}
  height={500}
  priority // Si es above the fold
  loading="lazy" // Si es below the fold
/>;
```

**Code Splitting:**

```tsx
// Dynamic imports
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("@/components/Heavy"), {
  loading: () => <p>Loading...</p>,
  ssr: false, // Si no necesitas SSR
});
```

**API Caching:**

```typescript
// App Router
export const revalidate = 60; // Revalidar cada 60 segundos

export async function GET() {
  const products = await prisma.product.findMany();
  return Response.json(products);
}
```

---

### 8. Deployment Issues (Vercel)

#### Error: "Build failed"

**Checklist:**

```bash
# 1. Build funciona local?
npm run build

# Si falla local, arreglar primero

# 2. Variables de entorno en Vercel?
# Vercel Dashboard > Project > Settings > Environment Variables

# 3. Node version correcta?
# package.json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

#### Database connection fails en producción

**Solución:**

```bash
# Usar connection pooling para producción
# DATABASE_URL debe incluir connection_limit

postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20

# O usar Prisma Accelerate
```

#### Environment variables no funcionan

**Solución:**

```bash
# En Vercel, NEXT_PUBLIC_ variables son para cliente
# Variables sin prefijo son solo para servidor

# ✅ Correcto:
NEXT_PUBLIC_API_URL=https://...  # Accesible en cliente
DATABASE_URL=postgresql://...    # Solo servidor

# ❌ Incorrecto:
API_URL=https://...  # NO accesible en cliente
```

---

### 9. Mobile Responsive Issues

#### Elementos se salen en móvil

**Solución:**

```scss
// globals.scss
* {
  box-sizing: border-box;
}

html,
body {
  overflow-x: hidden;
  max-width: 100vw;
}

img {
  max-width: 100%;
  height: auto;
}
```

```tsx
// Usar responsive containers
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px; // ← Importante

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;
```

#### Texto muy pequeño en móvil

**Solución:**

```scss
body {
  font-size: 16px; // Mínimo 16px en móvil

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 1.5;
  }
}

h1 {
  font-size: clamp(24px, 5vw, 48px); // Responsive fluido
}
```

---

### 10. Git Issues

#### Error: "Merge conflict"

**Solución:**

```bash
# Ver archivos en conflicto
git status

# Abrir archivo, buscar:
<<<<<<< HEAD
Tu código
=======
Código de otra rama
>>>>>>> branch-name

# Elegir qué código mantener, eliminar los markers

# Después:
git add .
git commit -m "resolve merge conflict"
```

#### Commit a rama equivocada

**Solución:**

```bash
# Mover último commit a otra rama
git log  # Copiar el hash del commit

# Cambiar a la rama correcta
git checkout correct-branch
git cherry-pick [commit-hash]

# Volver a rama incorrecta y deshacer commit
git checkout wrong-branch
git reset --hard HEAD~1
```

---

## 🆘 Emergency Procedures

### Sitio caído en producción

**Pasos:**

1. **Verificar status:**

   ```bash
   vercel logs [deployment-url]
   ```

2. **Rollback rápido:**

   ```bash
   # En Vercel dashboard:
   # Deployments > [Previous working] > "Promote to Production"
   ```

3. **Identificar causa:**
   - Revisar logs
   - Revisar último deploy
   - Revisar cambios recientes

4. **Fix y redeploy:**

   ```bash
   # Fix local
   git commit -m "hotfix: [description]"
   git push origin main
   # Auto-deploy en Vercel
   ```

5. **Comunicar al cliente:**
   ```
   "Detectamos un problema a las [hora].
   Lo resolvimos en [X minutos].
   Causa: [explicación simple].
   Sitio funcional nuevamente."
   ```

### Base de datos corrupta

**NO ENTRAR EN PÁNICO:**

1. **Verificar backups:**

   ```bash
   # Si usas Vercel Postgres
   # Dashboard > Storage > Backups
   ```

2. **Restaurar último backup válido**

3. **Si no hay backup:**
   - Consultar logs de Prisma
   - Intentar reparar con migrations

4. **Prevención futura:**
   ```bash
   # Setup automated backups
   # Cada 24 horas mínimo
   ```

---

## 🔍 Debugging Tips

### Console.log estratégico

```typescript
// ✅ Bueno:
console.log("Product data:", product);
console.log("API response:", { status: res.status, data: await res.json() });

// ❌ Malo:
console.log(product); // No sabes qué es
console.log("here"); // No sabes dónde
```

### React DevTools

```bash
# Instalar extensión de Chrome/Firefox
# Inspeccionar props, state, hooks
# Ver component tree
```

### Network Tab (Chrome DevTools)

```
1. Abrir DevTools (F12)
2. Network tab
3. Reproducir el problema
4. Verificar:
   - ¿API calls fallan? (status 4xx, 5xx)
   - ¿Requests lentos? (tiempo)
   - ¿Headers correctos?
```

---

## 📚 Resources

### Documentación oficial:

- Next.js: https://nextjs.org/docs
- Prisma: https://www.prisma.io/docs
- styled-components: https://styled-components.com/docs
- TypeScript: https://www.typescriptlang.org/docs

### Community:

- Stack Overflow
- GitHub Issues
- Discord communities

### Cuando estés atorado:

1. Lee el error completo
2. Googlea el error exacto
3. Revisa documentación oficial
4. Busca en Stack Overflow
5. Pregunta en comunidades

---

**El 90% de bugs se resuelven leyendo el error cuidadosamente** 🐛
