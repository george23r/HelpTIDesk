# 📞 Configuración de WhatsApp con Twilio

## Paso 1: Crear Cuenta de Twilio

1. Ve a https://www.twilio.com/try-twilio
2. Completa el formulario:
   - Email
   - Contraseña
   - Teléfono (para verificación)
3. Verifica tu teléfono con el código SMS
4. Confirma tu email

## Paso 2: Obtener Credenciales

### 2.1 Account SID y Auth Token
1. Entra a https://console.twilio.com
2. En el dashboard, verás:
   ```
   Account SID: ACxxx...
   Auth Token: (click en "Show" para ver)
   ```
3. **Copia ambos valores** - los necesitarás

### 2.2 Número de Teléfono de Twilio

1. En la consola, ve a **Phone Numbers** → **Manage**
2. Si tienes un número, úsalo
3. Si no, haz clic en **"Get your first Twilio phone number"**
4. Elige un número (puede ser cualquier país, pero prefieren US/EU)
5. **Copia el número** en formato: `+1234567890`

## Paso 3: Habilitar WhatsApp Sandbox

1. En la consola, ve a **Messaging** → **Try it out** → **Send an SMS**
2. En el menú izquierdo, busca **WhatsApp** → **Sandbox**
3. Verás un número de WhatsApp de Twilio y instrucciones
4. **Sigue las instrucciones** para activar tu número:
   - Abre WhatsApp
   - Envía el código de activación (por ejemplo: "join...")
   - Al número que aparece en el sandbox
5. Verás confirmación: "You are connected to the Twilio WhatsApp Sandbox"

## Paso 4: Obtener tu Número de WhatsApp

1. En WhatsApp, el contacto será: `+1415-...` (el número de Twilio)
2. Tu número en el .env es el TUYO (el que usaste para registrarte)
   - Ejemplo: `+34600000000` (tu teléfono personal)
3. Twilio solo permite enviar mensajes a números que se han unido al sandbox

## Paso 5: Configurar .env

Edita `backend/.env` y actualiza:

```env
TWILIO_ACCOUNT_SID=ACxxx...  (desde paso 2.1)
TWILIO_AUTH_TOKEN=token...   (desde paso 2.1)
TWILIO_PHONE_NUMBER=+1415... (el número de Twilio, paso 2.2)
```

Ejemplo real:
```env
TWILIO_ACCOUNT_SID=AC123abc456def...
TWILIO_AUTH_TOKEN=abcdef123456...
TWILIO_PHONE_NUMBER=+14155552368
```

## Paso 6: Instalar Cliente Twilio

```bash
cd backend
npm install twilio
```

## Paso 7: Habilitar WhatsApp en Notifications Service

En `src/notifications/notifications.service.ts`, **descomenta** la sección de WhatsApp:

```typescript
async sendTicketNotificationWhatsApp(
    phoneNumber: string,
    ticketData: {...}
  ): Promise<void> {
    try {
      const twilio = require('twilio');  // ← DESCOMENTA
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN,
      );

      const message = `🎫 Nuevo Ticket...`;

      await client.messages.create({  // ← DESCOMENTA
        body: message,
        from: `whatsapp:${process.env.TWILIO_PHONE_NUMBER}`,  // ← USA whatsapp:
        to: `whatsapp:${phoneNumber}`,  // ← USA whatsapp:
      });
      
      this.logger.log(`WhatsApp sent to ${phoneNumber}`);
    } catch (error) {
      this.logger.error(`Failed to send WhatsApp: ${error.message}`);
    }
  }
```

## Paso 8: Actualizar Usuario de Soporte con Número

Cuando crees o actualices un usuario, **incluye su número de WhatsApp**:

```bash
# Actualizar usuario en BD
UPDATE "User" SET "phone" = '+34600000000'
WHERE "email" = 'soporte@helptidesk.com';
```

O en el seed (`prisma/seed.ts`), ya está:
```typescript
const supportUser = await prisma.user.upsert({
  where: { email: 'soporte@helptidesk.com' },
  update: {},
  create: {
    email: 'soporte@helptidesk.com',
    password: await bcrypt.hash('soporte123', 10),
    role: 'ADMIN',
    isSupport: true,
    phone: '+34600000000', // ← ACTUALIZA CON TU NÚMERO
  },
});
```

## Paso 9: Probar

1. **Reinicia backend:**
   ```bash
   npm run start:dev
   ```

2. **Crea un ticket desde la app**

3. **Revisa WhatsApp** - deberías recibir un mensaje como:
   ```
   🎫 Nuevo Ticket de Soporte
   ID: clx1234...
   Título: Mi impresora no funciona
   Prioridad: HIGH
   ```

---

## ⚠️ Limitaciones del Sandbox

El sandbox de Twilio tiene limitaciones:

✅ Puedes enviar mensajes a números que se han unido al sandbox
❌ No puedes enviar a números arbitrarios sin un número de Twilio comprado/verificado

### Para producción:

1. Compra un número de Twilio (+1 cuesta ~$1/mes)
2. Solicita acceso a WhatsApp Business API
3. Twilio verificará tu cuenta
4. Entonces podrás enviar a cualquier número

## 🆘 Troubleshooting

### Error: "The To phone number supplied is not a valid WhatsApp number"
- Asegúrate de usar `whatsapp:` en los números
- El número debe estar en sandbox (o verificado en producción)
- Formato: `whatsapp:+34600000000`

### Error: "Invalid phone number format"
- Usa formato internacional: `+34600000000` (no 600000000)
- Incluye código de país y `+`

### No recibo mensajes
- Verifica que el número esté en el sandbox
- En WhatsApp, asegúrate de estar en el chat con Twilio
- Revisa los logs del backend: `WhatsApp notification sent to...`

---

## 📝 Resumen

| Campo | Valor | Dónde |
|-------|-------|-------|
| `TWILIO_ACCOUNT_SID` | AC... | Console Twilio dashboard |
| `TWILIO_AUTH_TOKEN` | token... | Console Twilio dashboard |
| `TWILIO_PHONE_NUMBER` | +14155552368 | Your Twilio phone number |
| `phone` en User | +34600000000 | Tu número personal |

¡Listo! Sigue estos pasos y el WhatsApp funcionará.
