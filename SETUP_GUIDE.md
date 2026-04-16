# 🚀 Guía Completa de Configuración - HelpTIDesk

## ✅ Estado Actual

- [x] PostgreSQL corriendo en Docker (localhost:5433)
- [x] Backend NestJS
- [x] Prisma con migraciones aplicadas  
- [x] Usuarios de prueba creados en la BD

## 📋 Usuarios de Prueba Disponibles

### 1. **ADMIN** (Gestión total + Recibe notificaciones)
```
Email: admin@helptidesk.com
Password: admin123
Rol: ADMIN
isSupport: true ← Recibe notificaciones de tickets
```

### 2. **SOPORTE** (Gestión de tickets + Recibe notificaciones)
```
Email: soporte@helptidesk.com
Password: soporte123
Rol: ADMIN
isSupport: true ← Recibe notificaciones de tickets
```

### 3. **USUARIO** (Crea tickets, no recibe notificaciones)
```
Email: usuario@ejemplo.com
Password: usuario123
Rol: USER
isSupport: false
```

---

## ⚙️ Paso 1: Configurar Variables de Entorno

Edita `backend/.env`:

```env
# Base de datos (Ya configurado ✓)
DATABASE_URL="postgresql://postgres:password@localhost:5433/helptidesk?schema=public"

# JWT (Ya configurado ✓)
JWT_SECRET="your-super-secret-jwt-key-at-least-32-chars"

# Servidor (Ya configurado ✓)
PORT=3000
NODE_ENV=development
```

### Para Notificaciones por Email (IMPORTANTE):

**Opción A: Usar Gmail** (Recomendado para pruebas)

1. Abre tu cuenta de Gmail
2. Habilita verificación en 2 pasos: https://myaccount.google.com/security
3. Ve a: https://myaccount.google.com/apppasswords
4. Copia la contraseña de 16 caracteres generada
5. Actualiza en `backend/.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=xxxx-xxxx-xxxx-xxxx  ← Pega aquí la de 16 caracteres
```

**Opción B: Usar cero configuración (desarrollo)**

Si no configuras email, el sistema logueará las tentativas pero no enviará emails reales.

### Para Notificaciones por WhatsApp (Opcional):

Solo si quieres WhatsApp via Twilio:

1. Crea cuenta en https://www.twilio.com
2. Copia tu `Account SID` y `Auth Token`
3. Actualiza `backend/.env`:

```env
TWILIO_ACCOUNT_SID=ACxxx...
TWILIO_AUTH_TOKEN=xxx...
TWILIO_PHONE_NUMBER=+34600000000
```

---

## ▶️ Paso 2: Iniciar Servicios

### Terminal 1 - PostgreSQL (si no está corriendo)
```bash
docker compose up -d postgres
```

### Terminal 2 - Backend NestJS
```bash
cd backend
npm run start:dev
```

Espera a ver:
```
[Nest] ... LOG [NestApplication] Nest application successfully started
[Nest] ... LOG Application is running on: http://localhost:3000
```

### Terminal 3 - App Móvil (opcional por ahora)
```bash
cd app
npm start
```

---

## 🧪 Paso 3: Probar Autenticación

### Usar Postman o curl

**1. Registrar nuevo usuario:**
```bash
curl -X POST http://localhost:3000/auth/register
  -H "Content-Type: application/json"
  -d '{"email":"test@test.com","password":"password123"}'
```

**2. Login:**
```bash
curl -X POST http://localhost:3000/auth/login
  -H "Content-Type: application/json"
  -d '{"email":"admin@helptidesk.com","password":"admin123"}'
```

Respuesta esperada:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

Guarda este token (`access_token`) - lo necesitarás para los siguientes pasos.

---

## 🎫 Paso 4: Probar Creación de Tickets (con Notificaciones)

**Crear un ticket:**

```bash
curl -X POST http://localhost:3000/tickets
  -H "Content-Type: application/json"
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN_HERE"
  -d '{
    "title": "Mi primer ticket",
    "description": "Hay un problema con...",
    "priority": "HIGH"
  }'
```

**Verificar notificaciones:**

1. **Email**: Revisa la bandeja de entrada de `admin@helptidesk.com` y `soporte@helptidesk.com`
   - Deberías recibir un email con:
     - Título del ticket
     - Descripción
     - Prioridad (colorida)
     - Quién lo creó

2. **Consola del backend**: Verás logs de las notificaciones:
   ```
   Email notification sent to admin@helptidesk.com
   WhatsApp notification would be sent to +34600000000
   ```

---

## 📱 Paso 5: Probar App Móvil

1. Inicia el backend (paso anterior)
2. En `app/`, ejecuta:
   ```bash
   npm start
   ```
3. Escanea el QR con tu teléfono (Expo)
4. **Login con:**
   - Email: `usuario@ejemplo.com`
   - Password: `usuario123`

5. **Crea un ticket desde la app** → Los admins recibirán la notificación

---

## 📊 Verificar Todo está Funcionando

Checklist final:

- [ ] Backend corriendo en puerto 3000
- [ ] PostgreSQL corriendo
- [ ] `npm run seed` ejecutado (usuarios en BD)
- [ ] Email configurado en `.env`
- [ ] Login funciona (obtienes JWT token)
- [ ] Crear ticket envia email a support staff
- [ ] App móvil se conecta al backend

---

## 🐛 Troubleshooting

### "Error: Unknown authentication strategy 'jwt'"
- Reinicia el backend con `npm run start:dev`

### "Email not sent"
- Verifica `EMAIL_USER` y `EMAIL_PASSWORD` en `.env`
- Para Gmail: asegúrate de usar "contraseña de aplicación" (no tu contraseña normal)

### "Database not found"
```bash
docker compose up -d postgres
npx prisma migrate dev --name init
npm run seed
```

### "Port 3000 already in use"
```bash
# Encuentra qué está usando el puerto
netstat -ano | findstr :3000
# Mata el proceso (reemplaza PID)
taskkill /PID <PID> /F
```

---

## 📚 Archivos Importantes

- `.env` - Variables de entorno del backend
- `.env.example` - Plantilla documentada
- `prisma/schema.prisma` - Modelo de datos
- `prisma/seed.ts` - Script de datos iniciales
- `ROLES_AND_NOTIFICATIONS.md` - Documentación de roles
- `src/notifications/` - Servicios de email/WhatsApp

---

¡Listo! El sistema está configurado y listo para usar. 🎉
