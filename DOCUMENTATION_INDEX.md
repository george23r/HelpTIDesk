# 📚 Índice de Documentación - HelpTIDesk

## 🎯 Por Donde Empezar

### Si es tu PRIMERA VEZ
1. Lee: **[SETUP_GUIDE.md](SETUP_GUIDE.md)**
   - Configuración inicial
   - Usuarios de prueba
   - Cómo iniciar servicios

### Si solo quieres WHATSAPP
1. Lee: **[WHATSAPP_QUICK_START.md](WHATSAPP_QUICK_START.md)** (5 pasos)
2. O: **[WHATSAPP_SETUP.md](WHATSAPP_SETUP.md)** (completo)
3. Luego ve a: **[NEXT_STEPS.md](NEXT_STEPS.md)**

### Si quieres entender TODA LA ARQUITECTURA
1. Lee: **[IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md)**
2. Lee: **[ROLES_AND_NOTIFICATIONS.md](backend/ROLES_AND_NOTIFICATIONS.md)**

### Si necesitas verificar tu PROGRESO
- **[CHECKLIST.md](CHECKLIST.md)** - Qué ya funciona y qué falta

---

## 📄 Guías Disponibles

### Configuración
| Archivo | Propósito |
|---------|-----------|
| [SETUP_GUIDE.md](SETUP_GUIDE.md) | Guía completa: BD, backend, app |
| [WHATSAPP_QUICK_START.md](WHATSAPP_QUICK_START.md) | WhatsApp en 5 pasos rápidos |
| [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) | WhatsApp: guía detallada con troubleshooting |
| [NEXT_STEPS.md](NEXT_STEPS.md) | Lo que hacer después de instalar |

### Técnico
| Archivo | Propósito |
|---------|-----------|
| [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) | Arquitectura del proyecto |
| [ROLES_AND_NOTIFICATIONS.md](backend/ROLES_AND_NOTIFICATIONS.md) | Explicación de roles y permisos |
| [HelpTIDesk_API.postman_collection.json](HelpTIDesk_API.postman_collection.json) | API endpoints para Postman |

### Referencia
| Archivo | Propósito |
|---------|-----------|
| [.env.example](backend/.env.example) | Variables de entorno necesarias |
| [README.md](README.md) | Descripción general del proyecto |

---

## 🎨 Directorio de Archivos

```
HelpTIDesk/
├── 📖 SETUP_GUIDE.md                    ← Comienza aquí
├── 📖 WHATSAPP_QUICK_START.md           ← Para WhatsApp rápido
├── 📖 WHATSAPP_SETUP.md                 ← WhatsApp detallado
├── 📖 NEXT_STEPS.md                     ← Después de instalar
├── 📖 IMPLEMENTATION_SUMMARY.md         ← Arquitectura tech
├── 📖 CHECKLIST.md                      ← Seguimiento
├── 📖 README.md                         ← Intro proyecto
├── 📋 HelpTIDesk_API.postman_collection.json
│
├── 📁 backend/
│   ├── .env                             ← Variables (NO compartir)
│   ├── .env.example                     ← Plantilla .env
│   ├── ROLES_AND_NOTIFICATIONS.md       ← Permisos explicados
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── auth/                        ← Autenticación
│   │   ├── tickets/                     ← Gestión de tickets
│   │   ├── users/                       ← Lista de usuarios
│   │   └── notifications/               ← Email + WhatsApp
│   └── prisma/
│       ├── schema.prisma                ← Modelo de datos
│       └── seed.ts                      ← Usuarios iniciales
│
└── 📁 app/
    ├── src/
    │   ├── screens/
    │   │   ├── LoginScreen.tsx
    │   │   ├── TicketsScreen.tsx        ← Para usuarios regulares
    │   │   └── SupportDashboardScreen.tsx ← Para support staff
    │   ├── services/
    │   │   ├── api.ts                   ← Cliente HTTP
    │   │   └── storage.ts               ← LocalStorage
    │   └── context/
    │       └── AuthContext.tsx          ← Estado de auth
    └── App.tsx                          ← Router principal
```

---

## 🧭 Guía por Rol

### 👨‍💻 Desarrollador Backend
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Instalación
2. [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Arquitectura
3. [ROLES_AND_NOTIFICATIONS.md](backend/ROLES_AND_NOTIFICATIONS.md) - Permisos

### 📱 Desarrollador Frontend
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Instalación
2. [IMPLEMENTATION_SUMMARY.md](IMPLEMENTATION_SUMMARY.md) - Flujo de app

### 🔧 DevOps/Infra
1. [SETUP_GUIDE.md](SETUP_GUIDE.md) - Docker, BD

### 📞 Para Configurar WhatsApp
1. [WHATSAPP_QUICK_START.md](WHATSAPP_QUICK_START.md) - **Comienza aquí**
2. [WHATSAPP_SETUP.md](WHATSAPP_SETUP.md) - Detalles

---

## 🎯 Usuarios de Prueba (después de seed)

```
Usuario Regular:
  Email: usuario@ejemplo.com
  Password: usuario123
  → Ve: TicketsScreen (crear tickets)

Personal Support:
  Email: soporte@helptidesk.com
  Password: soporte123
  → Ve: SupportDashboardScreen (gestionar tickets)

Admin:
  Email: admin@helptidesk.com
  Password: admin123
  → Ve: TicketsScreen + acceso a /users endpoint
```

---

## ⌨️ Comandos Útiles

```bash
# Backend
npm run start:dev           # Iniciar en watch mode
npm run seed               # Crear usuarios de prueba
npm run test               # Tests unitarios

# Prisma
npx prisma studio         # GUI de base de datos
npx prisma migrate dev    # Nuevo migration

# App
npm start                 # Iniciar Expo
npm run android           # Emulador Android
npm run ios               # Emulador iOS
```

---

## 🔗 Links Útiles

- **Twilio:** https://console.twilio.com
- **GitHub:** https://github.com
- **NestJS Docs:** https://docs.nestjs.com
- **React Native:** https://reactnative.dev
- **Prisma:** https://www.prisma.io/docs

---

## 📊 Progreso

- [x] Backend NestJS
- [x] Autenticación JWT
- [x] Base de datos PostgreSQL
- [x] App móvil React Native
- [x] Notificaciones por Email
- [x] Sistema de permisos (ADMIN/USER/isSupport)
- [ ] **WhatsApp Twilio** ← Tu próximo paso

---

**¿No sabes por dónde empezar?**

→ Si es nuevo: abre **[SETUP_GUIDE.md](SETUP_GUIDE.md)**  
→ Si solo quieres WhatsApp: abre **[WHATSAPP_QUICK_START.md](WHATSAPP_QUICK_START.md)**  
→ Si quieres seguimiento: abre **[CHECKLIST.md](CHECKLIST.md)**
