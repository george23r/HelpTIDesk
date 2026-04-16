# Backend - API REST con NestJS

Este es el backend de **HelpTIDesk**, un sistema de gestión de tickets de soporte.

**📖 Para documentación completa del proyecto, ver: [../README.md](../README.md)**

---

## 🚀 Setup Rápido

### Prerequisites
- Node.js 18+
- PostgreSQL (en Docker o local)

### Instalación

```bash
# Instalar dependencias
npm install

# Crear .env
cp .env.example .env

# Generar Prisma client
npx prisma generate

# Crear BD y tablas
npx prisma migrate dev --name init

# Ejecutar seeds (usuarios de prueba)
npm run seed
```

### Ejecutar

```bash
# Desarrollo (watch mode)
npm run start:dev

# Producción
npm run build
npm run start
```

Backend estará disponible en: `http://localhost:3000`

---

## 📋 Scripts Disponibles

```bash
npm run start:dev      # Desarrollo con reload automático
npm run build          # Compilar TypeScript
npm run start          # Ejecutar en producción
npm run test           # Tests unitarios
npm run test:e2e       # Tests E2E
npm run seed           # Crear datos de prueba
```

---

## 📁 Estructura

```
src/
├── auth/              # Autenticación JWT
├── tickets/           # CRUD de tickets
├── users/             # Gestión de usuarios
├── notifications/     # Email + WhatsApp
├── prisma/            # Configuración ORM
└── app.module.ts      # Root module
```

---

## 🔗 Endpoints Principales

**POST /auth/register** - Registrarse  
**POST /auth/login** - Iniciar sesión  
**GET /tickets** - Listar tickets  
**POST /tickets** - Crear ticket  
**PUT /tickets/:id** - Actualizar ticket  
**GET /users** - Listar usuarios (admin)
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
