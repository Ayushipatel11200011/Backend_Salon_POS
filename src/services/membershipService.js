const prisma = require('../utils/prismaClient');

async function createMembership(tenantId, data) {
  const { name, annualFee, discountPct, capacity, benefits } = data;
  return prisma.membership.create({
    data: {
      tenantId,
      name,
      annualFee: parseFloat(annualFee),
      discountPct: discountPct ? parseFloat(discountPct) : 0,
      capacity: capacity ? parseInt(capacity) : null,
      benefits: benefits || null,
    },
  });
}

async function getAllMemberships(tenantId) {
  const memberships = await prisma.membership.findMany({
    where: { tenantId },
    include: { _count: { select: { members: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return memberships.map((m) => ({
    ...m,
    memberCount: m._count.members,
    _count: undefined,
  }));
}

async function getMembershipById(tenantId, id) {
  const membership = await prisma.membership.findFirst({
    where: { id: parseInt(id), tenantId },
    include: {
      _count: { select: { members: true } },
      members: { select: { id: true, name: true, phone: true, loyaltyPoints: true } },
    },
  });
  if (!membership) {
    const err = new Error('Membership not found');
    err.status = 404;
    throw err;
  }
  return { ...membership, memberCount: membership._count.members };
}

async function updateMembership(tenantId, id, data) {
  const { name, annualFee, discountPct, capacity, benefits } = data;
  return prisma.membership.update({
    where: { id: parseInt(id), tenantId },
    data: {
      name,
      annualFee: annualFee !== undefined ? parseFloat(annualFee) : undefined,
      discountPct: discountPct !== undefined ? parseFloat(discountPct) : undefined,
      capacity: capacity !== undefined ? (capacity ? parseInt(capacity) : null) : undefined,
      benefits: benefits !== undefined ? benefits || null : undefined,
    },
  });
}

async function deleteMembership(tenantId, id) {
  await prisma.member.updateMany({
    where: { membershipId: parseInt(id), tenantId },
    data: { membershipId: null },
  });
  return prisma.membership.delete({ where: { id: parseInt(id), tenantId } });
}

module.exports = {
  createMembership,
  getAllMemberships,
  getMembershipById,
  updateMembership,
  deleteMembership,
};
