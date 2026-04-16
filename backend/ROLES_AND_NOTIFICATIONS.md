# Sistema de Roles y Notificaciones

## Roles de Usuario

### USER (Usuario Regular)
- **Descripción**: Cliente o usuario final que reporta problemas
- **Permisos**:
  - Crear tickets
  - Ver sus propios tickets
  - Ver tickets asignados a él
  - Actualizar estado de sus tickets
  - Eliminar sus propios tickets

### ADMIN (Personal de Soporte)
- **Descripción**: Personal de soporte técnico
- **Permisos**:
  - Crear, leer, actualizar y eliminar tickets
  - Asignar tickets a otros staff
  - Ver todos los tickets del sistema

### Campo `isSupport`
- **Nuevo campo**: `isSupport: boolean` (default: false)
- **Uso**: Indica que el usuario es personal de soporte y debe recibir notificaciones
- Un usuario puede ser ADMIN pero no estar marcado como support staff
- Un usuario USER con `isSupport: true` también recibirá notificaciones

## Sistema de Notificaciones

### Cuándo se envían
- **Cuando**: Se crea un nuevo ticket
- **A quién**: Todos los usuarios con `isSupport: true`
- **Qué incluye**: ID, título, descripción, prioridad y quién lo creó

### Canales

#### Email
- Configuración: Variables de entorno `EMAIL_HOST`, `EMAIL_USER`, `EMAIL_PASSWORD`
- Proveedor recomendado: Gmail con contraseña de aplicación
- Pasos para Gmail:
  1. Habilita autenticación de 2 factores en tu cuenta Gmail
  2. Ve a https://myaccount.google.com/apppasswords
  3. Copia la contraseña de aplicación generada
  4. Pégala en `EMAIL_PASSWORD` del `.env`

#### WhatsApp (Twilio)
- Configuración: Variables `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_PHONE_NUMBER`
- Campo `phone` en el usuario debe contener el número en formato: +1234567890
- Requiere cuenta de prueba de Twilio (gratis inicialmente)
- Por ahora está comentado en el código - descomenta cuando tengas Twilio configurado

## Cómo configurar

### Crear un usuario de soporte
```sql
UPDATE "User" SET "isSupport" = true, "role" = 'ADMIN', "phone" = '+1234567890'
WHERE "email" = 'support@helptidesk.com';
```

### Configuración recomendada
1. Crea usuário ADMIN + isSupport (recibe notificaciones)
2. Crea usuarios USER (no reciben notificaciones)
3. Configura EMAIL en `.env`
4. (Opcional) Configura TWILIO cuando necesites WhatsApp
