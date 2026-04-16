import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  console.log('🌱 Iniciando seed...');

  // Limpiar usuarios existentes (opcional)
  // await prisma.user.deleteMany({});

  // Crear usuario ADMIN/SUPPORT
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@helptidesk.com' },
    update: {},
    create: {
      email: 'admin@helptidesk.com',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN',
      isSupport: true,
      phone: '+34600000000', // Para WhatsApp (formato internacional)
    },
  });

  console.log('✅ Usuario ADMIN creado:', adminUser.email);

  // Crear usuario USER (soporte técnico que también recibe notificaciones)
  const supportUser = await prisma.user.upsert({
    where: { email: 'soporte@helptidesk.com' },
    update: { phone: '+573152212196' },
    create: {
      email: 'soporte@helptidesk.com',
      password: await bcrypt.hash('soporte123', 10),
      role: 'ADMIN',
      isSupport: true,
      phone: '+573152212196',
    },
  });

  console.log('✅ Usuario SOPORTE creado:', supportUser.email);

  // Crear usuario regular (cliente)
  const regularUser = await prisma.user.upsert({
    where: { email: 'usuario@ejemplo.com' },
    update: {},
    create: {
      email: 'usuario@ejemplo.com',
      password: await bcrypt.hash('usuario123', 10),
      role: 'USER',
      isSupport: false,
      phone: null,
    },
  });

  console.log('✅ Usuario REGULAR creado:', regularUser.email);

  console.log('\n📋 Usuarios de prueba:');
  console.log('---');
  console.log('ADMIN: admin@helptidesk.com / admin123');
  console.log('SOPORTE: soporte@helptidesk.com / soporte123');
  console.log('USUARIO: usuario@ejemplo.com / usuario123');
  console.log('---\n');
  console.log('📱 Números WhatsApp:');
  console.log(`   Admin: ${adminUser.phone}`);
  console.log(`   Soporte: ${supportUser.phone}`);
  console.log('\n⚙️ Para recibir notificaciones por WhatsApp:');
  console.log('   1. Configura Twilio en .env (WHATSAPP_QUICK_START.md)');
  console.log('   2. Únete al WhatsApp Sandbox de Twilio');
  console.log('   3. Ejecuta: npm run seed\n');

  process.exit(0);
}

seed()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  });
