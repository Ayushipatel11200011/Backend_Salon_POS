const prisma = require('../utils/prismaClient');

async function createPackage(tenantId, data) {
  const { name, price, originalPrice, badge, services } = data;
  return prisma.package.create({
    data: {
      tenantId,
      name,
      price: parseFloat(price),
      originalPrice: originalPrice ? parseFloat(originalPrice) : null,
      badge: badge || null,
      services: Array.isArray(services) ? services : services.split(',').map((s) => s.trim()),
      isActive: true,
    },
  });
}

async function getAllPackages(tenantId, { isActive } = {}) {
  const where = { tenantId };
  if (isActive !== undefined) where.isActive = isActive === 'true' || isActive === true;
  return prisma.package.findMany({ where, orderBy: { createdAt: 'desc' } });
}

async function getActivePackages(tenantId) {
  return prisma.package.findMany({ where: { tenantId, isActive: true }, orderBy: { createdAt: 'desc' } });
}

async function getPackageById(tenantId, id) {
  const pkg = await prisma.package.findFirst({ where: { id: parseInt(id), tenantId } });
  if (!pkg) {
    const err = new Error('Package not found');
    err.status = 404;
    throw err;
  }
  return pkg;
}

async function updatePackage(tenantId, id, data) {
  const { name, price, originalPrice, badge, services } = data;
  return prisma.package.update({
    where: { id: parseInt(id), tenantId },
    data: {
      name,
      price: price !== undefined ? parseFloat(price) : undefined,
      originalPrice: originalPrice !== undefined ? (originalPrice ? parseFloat(originalPrice) : null) : undefined,
      badge: badge !== undefined ? badge || null : undefined,
      services: services
        ? Array.isArray(services)
          ? services
          : services.split(',').map((s) => s.trim())
        : undefined,
    },
  });
}

async function togglePackage(tenantId, id, isActive) {
  return prisma.package.update({
    where: { id: parseInt(id), tenantId },
    data: { isActive },
  });
}

async function deletePackage(tenantId, id) {
  return prisma.package.delete({ where: { id: parseInt(id), tenantId } });
}

module.exports = {
  createPackage,
  getAllPackages,
  getActivePackages,
  getPackageById,
  updatePackage,
  togglePackage,
  deletePackage,
};
