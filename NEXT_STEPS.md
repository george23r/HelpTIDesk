# 📞 WhatsApp - Próximos Pasos para Ti

## 🎯 Tu Tarea Ahora

Sigue **WHATSAPP_QUICK_START.md** (5 pasos simples):

```
1️⃣ Ve a https://www.twilio.com/try-twilio
2️⃣ Obtén credenciales en https://console.twilio.com
3️⃣ Obtén número Twilio
4️⃣ Activa WhatsApp Sandbox
5️⃣ Actualiza backend/.env + prisma/seed.ts
```

---

## 📝 Ejemplo de Configuración Final

Tu `backend/.env` debe verse así:

```env
DATABASE_URL="..."
JWT_SECRET="..."
PORT=3000

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tutuyo@gmail.com
EMAIL_PASSWORD=tu-app-password

# ← ESTO ES LO NUEVO:
TWILIO_ACCOUNT_SID=ACe1234567890abcdef1234567890ab
TWILIO_AUTH_TOKEN=1234567890abcdef1234567890abcd
TWILIO_PHONE_NUMBER=+14155552368
```

Tu `prisma/seed.ts` debe tener:

```typescript
phone: '+34912345678',  // TU número WhatsApp
```

---

## ✅ Después de Configurar

```bash
# 1. Ejecuta seed
npm run seed

# 2. Reinicia backend
npm run start:dev

# 3. Abre la app
npm start (en el otro terminal)

# 4. Crea un ticket
# ✅ Deberías recibir WhatsApp automáticamente
```

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| WhatsApp no llega | Número debe estar en Sandbox |
| "Invalid format" | Usa +34912345678 (internacional) |
| "Twilio not configured" | TWILIO_ACCOUNT_SID no está en .env |
| Mensajes en consola | Ver logs con grep "WhatsApp" |

---

## 📚 Archivos Útiles

Para referencia rápida:
- **[WHATSAPP_QUICK_START.md](WHATSAPP_QUICK_START.md)** ← LÉELO PRIMERO
- **[WHATSAPP_SETUP.md](WHATSAPP_SETUP.md)** ← Detalles completos
- **[CHECKLIST.md](CHECKLIST.md)** ← Seguimiento

---

**¿Preguntas?** Revisa WHATSAPP_SETUP.md sección "Troubleshooting"

**¡Casi listo!** Solo necesitas 10 minutos para configurar Twilio 🚀
