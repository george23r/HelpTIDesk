# TODO: Implementación HelpDesk App - Sistema de Gestión de Incidencias

## Estado General: ✅ Plan Aprobado | ⏳ En Progreso | ❌ Pendiente

### 1. Setup Inicial del Proyecto (⏳ En Progreso)
   - [x] Docker confirmado.
- [x] Verificar Node.js >=18, npm. (v24.14.0)
  - [ ] Verificar Expo CLI.
  - [x] Backend base creado.
- [x] Backend base creado.
- [x] Deps Prisma/auth instaladas (npm success).
  - [ ] Prisma init.
  - [x] Dockerfile creado.
  - [ ] docker-compose PG.
- [x] Schema User/Ticket creado.
- [ ] Prisma generate/migrate.
  - [x] Schema fixed for Prisma 7.
  - [ ] PrismaService.
  - [ ] Auth module (login/register).
  - [ ] Tickets module (CRUD).
   - [ ] Crear estructura directorios: `/backend`, `/mobile`, `/docker`, `/.github/workflows`.
   - [ ] Inicializar Git submodules o mover Android a `/legacy`.

### 2. Backend NestJS (⏳ Pendiente)
   - [ ] `npx @nestjs/cli new backend --package-manager npm`
   - [ ] Instalar deps: Prisma, @nestjs/jwt, class-validator, etc.
   - [ ] Crear Prisma schema (users, tickets).
   - [ ] Implementar módulos: auth, tickets (controllers, services, DTOs).
   - [ ] Guards JWT, endpoints REST.
   - [ ] Dockerfile y docker-compose.

### 3. Base de Datos (⏳ Pendiente)
   - [ ] `npx prisma migrate dev`.
   - [ ] Seed data opcional.

### 4. Frontend Mobile Expo (⏳ Pendiente)
   - [ ] `npx create-expo-app mobile`.
   - [ ] Screens: Login, Dashboard, CreateTicket.
   - [ ] AuthContext, API service.
   - [ ] Integrar con backend.

### 5. DevOps & Despliegue (⏳ Pendiente)
   - [ ] CI/CD GitHub Actions.
   - [ ] .env.example, variables.
   - [ ] Despliegue Railway: DB + backend.

### 6. Documentación & Polish (⏳ Pendiente)
   - [ ] README.md completo.
   - [ ] Tests básicos (Jest).
   - [ ] Logs, errores handling.

**Próximo Paso:** Confirmar setup entorno y crear estructura.

**Fecha Inicio:** [Actualizar]
