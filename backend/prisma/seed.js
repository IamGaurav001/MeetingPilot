/**
 * Database seed script.
 *
 * Seeds a demo user for local development.
 * Run with: npm run db:seed
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const hashedPassword = await bcrypt.hash('password123', 12);

  await prisma.user.upsert({
    where: { email: 'demo@meetingpilot.ai' },
    update: {},
    create: {
      name: 'Demo User',
      email: 'demo@meetingpilot.ai',
      password: hashedPassword,
    },
  });

  console.log('Seed complete: demo@meetingpilot.ai / password123');
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
