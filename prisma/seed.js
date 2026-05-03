  require("dotenv").config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');

const connectionString = process.env.DATABASE_URL

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  // Create default tenant
  const defaultTenant = await prisma.tenant.upsert({
    where: { slug: 'default' },
    update: {},
    create: {
      name: 'Default Salon',
      slug: 'default',
      isActive: true,
    },
  });

  await prisma.loyaltySettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      minPointsRedeem: 100,
      conversionRate: 10,
      maxRedeemPerVisit: 500,
      pointsExpiryMonths: null,
    },
  });

  const gold = await prisma.membership.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      name: 'Gold',
      annualFee: 4999,
      discountPct: 20,
      capacity: 170,
      benefits: 'Priority booking · Free annual treatment · 2x points',
    },
  });

  const pearl = await prisma.membership.upsert({
    where: { id: 2 },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      name: 'Pearl',
      annualFee: 2499,
      discountPct: 10,
      capacity: 300,
      benefits: 'Monthly complimentary service · 1.5x points',
    },
  });

  const silver = await prisma.membership.upsert({
    where: { id: 3 },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      name: 'Silver',
      annualFee: 999,
      discountPct: 5,
      capacity: 200,
      benefits: 'Birthday reward · Standard points',
    },
  });

  await prisma.package.upsert({
    where: { id: 1 },
    update: {},
    create: {
      tenantId: defaultTenant.id,
      name: 'Bridal Glow Bundle',
      price: 12999,
      originalPrice: 16500,
      badge: 'Best Value',
      services: ['Bridal Makeup', 'Hair Styling', 'Mehendi', 'Facial', 'Manicure', 'Pedicure'],
      isActive: true,
    },
  });

  console.log('Seed completed successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());