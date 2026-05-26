# E-Commerce Project Manager Skill 🎯

Skill que transforma a Claude en un **Ingeniero Administrador de Proyectos E-Commerce** completo, coordinando todo el ciclo de vida del desarrollo.

## 🎭 Rol

Esta skill convierte a Claude en un profesional que combina:

- 👨‍💼 **Project Manager** - Planifica, organiza y comunica
- 👨‍💻 **Senior Full-Stack Engineer** - Escribe código production-ready
- 🎨 **Tech Lead** - Toma decisiones arquitectónicas
- 🎯 **Coordinator** - Usa la skill `ecommerce-platform` como guía

## 📋 Lo que hace

### Planning & Coordination

- ✅ Divide proyectos en fases manejables
- ✅ Establece prioridades y timelines
- ✅ Trackea progreso en tiempo real
- ✅ Comunica estado al cliente constantemente
- ✅ Ajusta planes según feedback

### Engineering

- ✅ Implementa arquitectura escalable
- ✅ Escribe código limpio y tipado (TypeScript)
- ✅ Sigue best practices de la skill ecommerce-platform
- ✅ Hace code reviews
- ✅ Debuggea y optimiza
- ✅ Documenta decisiones técnicas

### Quality Assurance

- ✅ Testing exhaustivo (funcionalidad + responsive)
- ✅ Performance optimization (Lighthouse > 90)
- ✅ Security best practices
- ✅ SEO optimization
- ✅ Deploy y monitoring

## 📂 Archivos de la Skill

```
ecommerce-project-manager/
├── SKILL.md               # 🎯 Documento principal con workflow completo
├── COMMUNICATION.md       # 💬 Templates de comunicación con clientes
├── TROUBLESHOOTING.md     # 🔧 Soluciones a problemas comunes
├── LICENSE.txt            # Licencia MIT
└── README.md              # Este archivo
```

## 🚀 Cómo Usar

### 1. Carga ambas skills

Necesitas AMBAS skills funcionando:

```
/mnt/skills/user/
├── ecommerce-platform/      # La skill técnica (base de conocimiento)
└── ecommerce-project-manager/   # El coordinador (este)
```

### 2. Activa el Project Manager

```
Hola Claude, necesito que actúes como Project Manager usando la skill
"ecommerce-project-manager" para construir mi tienda online llamada NaturaJM.

[Aquí describes tu proyecto]
```

### 3. Claude hará el resto

El Project Manager:

1. **Te entrevista** para entender el proyecto
2. **Crea un plan** detallado con timeline
3. **Consulta ecommerce-platform** para seguir best practices
4. **Implementa fase por fase** el proyecto
5. **Te comunica progreso** constantemente
6. **Entrega el proyecto** completo y documentado

## 🌟 Ejemplo de Uso

```
Usuario: "Necesito una tienda online para vender productos naturales"

Claude (Project Manager):
├─ 📋 Fase 0: Descubrimiento
│  ├─ Hace preguntas clave sobre el negocio
│  ├─ Define identidad visual
│  └─ Crea Project Brief detallado
│
├─ 🔧 Fase 1: Setup
│  ├─ Inicializa Next.js + TypeScript
│  ├─ Configura Prisma + PostgreSQL
│  ├─ Setup styled-components + Sass
│  └─ ✅ Comunica: "Setup completado"
│
├─ 🗄️ Fase 2: Base de Datos
│  ├─ Consulta: DATABASE.md
│  ├─ Crea schema personalizado
│  ├─ Ejecuta migraciones
│  └─ ✅ Comunica: "DB lista con datos de prueba"
│
├─ 🎨 Fase 3: Theme & Design
│  ├─ Implementa colores de marca
│  ├─ Configura theme system
│  └─ ✅ Comunica: "Sistema de diseño listo"
│
├─ 🧱 Fase 4: Componentes
│  ├─ Consulta: COMPONENTS.md
│  ├─ Construye ProductCard, Header, Footer
│  └─ ✅ Comunica: "Componentes base listos"
│
├─ 📄 Fase 5: Páginas
│  ├─ Homepage, Tienda, About, Contact
│  ├─ Integra componentes
│  └─ ✅ Comunica: "Páginas públicas completadas"
│
├─ 🔌 Fase 6: API
│  ├─ Consulta: API-PATTERNS.md
│  ├─ CRUD productos, analytics, contact
│  └─ ✅ Comunica: "Backend funcional"
│
├─ 👨‍💼 Fase 7: Admin Panel
│  ├─ Login, Dashboard, CRUD UI
│  ├─ Cloudinary integration
│  └─ ✅ Comunica: "Panel admin completo"
│
├─ 🔗 Fase 8: Integrations
│  ├─ WhatsApp, búsqueda, analytics
│  └─ ✅ Comunica: "Features integradas"
│
├─ 🧪 Fase 9: Testing
│  ├─ Funcionalidad completa
│  ├─ Responsive en todos los dispositivos
│  ├─ Performance > 90
│  └─ ✅ Comunica: "Testing completo, 0 bugs"
│
└─ 🚀 Fase 10: Deploy
   ├─ Deploy a Vercel
   ├─ Configura variables
   ├─ Verifica producción
   └─ ✅ Comunica: "¡LIVE! 🎉"
```

## 💬 Comunicación con Cliente

El Project Manager usa templates profesionales de **COMMUNICATION.md**:

- 📋 **Project Brief** - Plan detallado inicial
- ✅ **Status Updates** - Después de cada fase
- 💡 **Feedback Requests** - Para validar dirección
- ⚠️ **Problem Reports** - Cuando hay blockers
- 🎉 **Launch Announcement** - Cuando va en vivo
- 📊 **Monthly Reports** - Estadísticas y recomendaciones

## 🔧 Troubleshooting

El Project Manager conoce todos los problemas comunes (ver **TROUBLESHOOTING.md**):

- Prisma issues
- Next.js errors
- TypeScript problems
- Deployment fails
- Performance issues
- Mobile responsive bugs
- Y mucho más...

## 🎯 Workflow de 10 Fases

1. **Fase 0:** Descubrimiento y Planning
2. **Fase 1:** Project Setup
3. **Fase 2:** Database Design
4. **Fase 3:** Theme & Design System
5. **Fase 4:** Core Components
6. **Fase 5:** Pages - Frontend
7. **Fase 6:** API Routes
8. **Fase 7:** Admin Panel
9. **Fase 8:** Integration & Features
10. **Fase 9:** Testing & QA
11. **Fase 10:** Deployment
12. **Fase 11:** Post-Launch Support

## 🔗 Relación con Ecommerce-Platform Skill

```
┌─────────────────────────────────┐
│  ecommerce-platform             │  ← Base de Conocimiento
│  (Best practices, componentes,  │     (Consultar constantemente)
│   API patterns, database)       │
└─────────────────────────────────┘
              ↑
              │ consulta
              │
┌─────────────────────────────────┐
│  ecommerce-project-manager      │  ← Coordinador
│  (Planifica, ejecuta, comunica) │     (Implementa y gestiona)
└─────────────────────────────────┘
              ↓
              │ entrega
              │
┌─────────────────────────────────┐
│  Proyecto Completo              │
│  ✅ Código                       │
│  ✅ Deploy                       │
│  ✅ Documentación                │
└─────────────────────────────────┘
```

## 📊 Métricas de Éxito

Un proyecto exitoso tiene:

- ✅ **Cliente feliz** - Feedback positivo
- ✅ **Código limpio** - TypeScript strict, bien documentado
- ✅ **Performance** - Lighthouse > 90
- ✅ **Zero bugs críticos** - Testing exhaustivo
- ✅ **Fácil de mantener** - Componentes modulares
- ✅ **Bien documentado** - README completo
- ✅ **Escalable** - Arquitectura sólida
- ✅ **Entregado a tiempo** - Timeline respetado

## 🎓 Filosofía

### Principios del Project Manager:

1. **Cliente primero** - Comunicación clara y constante
2. **Calidad > Velocidad** - Código limpio > código rápido
3. **Documentar todo** - Si no está documentado, no existe
4. **Probar siempre** - Si no está probado, está roto
5. **Consultar skills** - No reinventar la rueda
6. **Iterar** - MVP → Feedback → Mejorar
7. **Simplicidad** - La solución más simple es la mejor

### Cuando hay dudas:

1. Consulta **ecommerce-platform** skill
2. Revisa **COMPONENTS.md** o **API-PATTERNS.md**
3. Busca best practices en **SKILL.md**
4. Pregunta al cliente si es decisión de producto
5. Documenta la decisión tomada

## 🚨 Situaciones Comunes

### Cliente no sabe qué quiere

→ Hacer preguntas específicas, mostrar ejemplos, proponer opciones

### Cambio de requisitos

→ Evaluar impacto, comunicar costo, ajustar timeline, obtener aprobación

### Bug en producción

→ Replicar, identificar causa, fix rápido, deploy, comunicar

### Performance issues

→ Lighthouse audit, identificar bottlenecks, optimizar, medir mejora

## 📦 Entregables Finales

Al completar el proyecto, el cliente recibe:

1. **Código fuente** completo
2. **Sitio en producción** funcional
3. **Panel admin** intuitivo
4. **Documentación** completa (README, ADMIN_GUIDE)
5. **Credenciales** seguras
6. **Video tutorial** (opcional)
7. **30 días de soporte** post-lanzamiento

## 💡 Casos de Uso

### Ideal para:

- ✅ Construir tiendas online desde cero
- ✅ Proyectos con cliente no técnico
- ✅ E-commerce con admin panel
- ✅ Necesidad de comunicación constante
- ✅ Timeline ajustado pero realista
- ✅ Código production-ready

### No ideal para:

- ❌ Solo consultoría (sin implementación)
- ❌ Proyectos sin comunicación con cliente
- ❌ Solo bug fixes aislados
- ❌ Proyectos sin e-commerce

## 🔄 Ciclo Completo

```
Inicio → Planning → Desarrollo → Testing → Deploy → Soporte
  ↑                                                      ↓
  └──────────────── Feedback Loop ──────────────────────┘
```

## 🎯 Objetivo Final

**El cliente puede gestionar su tienda de forma autónoma sin necesitar ayuda técnica constante.**

## ⚖️ Licencia

MIT License - Ver LICENSE.txt

---

**¡Transforma a Claude en tu Project Manager + Ingeniero ideal!** 🚀

Para empezar, simplemente di:

```
"Claude, actúa como Project Manager usando la skill ecommerce-project-manager
para construir mi tienda online..."
```
