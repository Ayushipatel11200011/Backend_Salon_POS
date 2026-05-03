const prisma = require('../utils/prismaClient');

async function createTenant(data) {
  const { name, slug } = data;
  return prisma.tenant.create({
    data: { name, slug: slug.toLowerCase().replace(/\s+/g, '-') },
  });
}

async function getAllTenants() {
  return prisma.tenant.findMany({ orderBy: { createdAt: 'asc' } });
}

async function getTenantById(id) {
  const tenant = await prisma.tenant.findUnique({ where: { id: parseInt(id) } });
  if (!tenant) {
    const err = new Error('Tenant not found');
    err.status = 404;
    throw err;
  }
  return tenant;
}

async function updateTenant(id, data) {
  const { name, isActive } = data;
  return prisma.tenant.update({
    where: { id: parseInt(id) },
    data: {
      name: name || undefined,
      isActive: isActive !== undefined ? isActive : undefined,
    },
  });
}

module.exports = { createTenant, getAllTenants, getTenantById, updateTenant };
