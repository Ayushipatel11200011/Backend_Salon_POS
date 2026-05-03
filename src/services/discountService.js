const prisma = require('../utils/prismaClient');

const VALID_TYPES = ['PERCENTAGE', 'FLAT', 'BOGO', 'COMBO'];

async function createDiscount(tenantId, data) {
  const { name, type, value, appliesTo, validFrom, validTo, notes } = data;

  if (!VALID_TYPES.includes(type.toUpperCase())) {
    const err = new Error(`Invalid discount type. Must be one of: ${VALID_TYPES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  return prisma.discount.create({
    data: {
      tenantId,
      name,
      type: type.toUpperCase(),
      value: String(value),
      appliesTo: Array.isArray(appliesTo) ? appliesTo : [appliesTo],
      validFrom: validFrom ? new Date(validFrom) : null,
      validTo: validTo ? new Date(validTo) : null,
      notes: notes || null,
      isActive: true,
    },
  });
}

async function getAllDiscounts(tenantId, { type, isActive } = {}) {
  const where = { tenantId };
  if (type) where.type = type.toUpperCase();
  if (isActive !== undefined) where.isActive = isActive === 'true' || isActive === true;
  return prisma.discount.findMany({ where, orderBy: { createdAt: 'desc' } });
}

async function getActiveDiscounts(tenantId) {
  return prisma.discount.findMany({
    where: {
      tenantId,
      isActive: true,
      OR: [{ validTo: null }, { validTo: { gte: new Date() } }],
    },
    orderBy: { createdAt: 'desc' },
  });
}

async function getDiscountById(tenantId, id) {
  const discount = await prisma.discount.findFirst({ where: { id: parseInt(id), tenantId } });
  if (!discount) {
    const err = new Error('Discount not found');
    err.status = 404;
    throw err;
  }
  return discount;
}

async function updateDiscount(tenantId, id, data) {
  const { name, type, value, appliesTo, validFrom, validTo, notes } = data;

  if (type && !VALID_TYPES.includes(type.toUpperCase())) {
    const err = new Error(`Invalid discount type. Must be one of: ${VALID_TYPES.join(', ')}`);
    err.status = 400;
    throw err;
  }

  return prisma.discount.update({
    where: { id: parseInt(id), tenantId },
    data: {
      name,
      type: type ? type.toUpperCase() : undefined,
      value: value !== undefined ? String(value) : undefined,
      appliesTo: appliesTo ? (Array.isArray(appliesTo) ? appliesTo : [appliesTo]) : undefined,
      validFrom: validFrom !== undefined ? (validFrom ? new Date(validFrom) : null) : undefined,
      validTo: validTo !== undefined ? (validTo ? new Date(validTo) : null) : undefined,
      notes: notes !== undefined ? notes : undefined,
    },
  });
}

async function toggleDiscount(tenantId, id, isActive) {
  return prisma.discount.update({
    where: { id: parseInt(id), tenantId },
    data: { isActive },
  });
}

async function deleteDiscount(tenantId, id) {
  return prisma.discount.delete({ where: { id: parseInt(id), tenantId } });
}

module.exports = {
  createDiscount,
  getAllDiscounts,
  getActiveDiscounts,
  getDiscountById,
  updateDiscount,
  toggleDiscount,
  deleteDiscount,
};
