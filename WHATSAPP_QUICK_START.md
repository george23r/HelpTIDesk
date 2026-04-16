# ⚡ WhatsApp - Guía Rápida (5 pasos)

## 1️⃣ Crear Cuenta Twilio
```
1. Ve a: https://www.twilio.com/try-twilio
2. Llena el formulario + verifica tu teléfono
3. Confirma el email
```

## 2️⃣ Obtener Credenciales
```
1. Entra a: https://console.twilio.com
2. Dashboard → ves "Account SID" y "Auth Token"
3. Copia ambos
```

## 3️⃣ Obtener Número Sandbox (GRATIS)
```
1. Ve a: https://console.twilio.com/us/account/messaging/whatsapp/sandbox
2. Verás un número de prueba automático (ej: +14155552368)
3. Ese número es GRATIS para desarrollo
4. Cópialo
```

## 4️⃣ Activar WhatsApp Sandbox
```
1. Messaging → Try it out → Send an SMS
2. En el menu: WhatsApp → Sandbox
3. Sigue instrucciones: abre WhatsApp y envía el código
4. Confirma: "You are connected"
```

## 5️⃣ Configurar en HelpTIDesk

### Actualiza `backend/.env`:
```env
TWILIO_ACCOUNT_SID=ACxxx...        ← Desde step 2
TWILIO_AUTH_TOKEN=token...         ← Desde step 2
TWILIO_PHONE_NUMBER=+14155...      ← Desde step 3
```

### Actualiza `prisma/seed.ts` con TU número:
```typescript
phone: '+34600000000'  ← CAMBIA ESTO a tu número WhatsApp
```

### Reinicia:
```bash
cd backend
npm run seed
npm run start:dev
```

## ✅ Listo!

Crea un ticket desde la app → Recibe WhatsApp automático 📱

---

## 🔗 Links
- Twilio: https://console.twilio.com
- Documentación: https://www.twilio.com/docs/whatsapp

## 💡 Nota
El Sandbox permite enviar a números que se unieron.
Para enviar a cualquier número, compra un número de Twilio (~$1/mes) en producción.
