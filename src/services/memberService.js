const prisma = require("../utils/prismaClient");

async function createMember(tenantId, data) {
  const { name, phone, email, dob, membershipId, startingPoints } = data;
  return prisma.member.create({
    data: {
      tenantId,
      name,
      phone,
      email: email || null,
      dob: dob ? new Date(dob) : null,
      membershipId: membershipId || null,
      loyaltyPoints: startingPoints || 0,
    },
    include: { membership: true },
  });
}

async function getAllMembers(tenantId, { membershipId, search } = {}) {
  const where = { tenantId };
  if (membershipId) where.membershipId = parseInt(membershipId);
  if (search) {
    where.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { phone: { contains: search } },
      { email: { contains: search, mode: "insensitive" } },
    ];
  }
  return prisma.member.findMany({
    where,
    select: {
      id: true,
      name: true,
      phone: true,
      loyaltyPoints: true,
      createdAt: true,
      membership: { select: { name: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

async function getMemberById(tenantId, id) {
  const member = await prisma.member.findFirst({
    where: { id: parseInt(id), tenantId },
    include: {
      membership: true,
      transactions: { orderBy: { createdAt: "desc" }, take: 20 },
    },
  });
  if (!member) {
    const err = new Error("Member not found");
    err.status = 404;
    throw err;
  }
  return member;
}

async function updateMember(tenantId, id, data) {
  const { name, phone, email, dob, membershipId } = data;
  return prisma.member.update({
    where: { id: parseInt(id), tenantId },
    data: {
      name,
      phone,
      email: email || null,
      dob: dob ? new Date(dob) : undefined,
      membershipId: membershipId !== undefined ? membershipId || null : undefined,
    },
    include: { membership: true },
  });
}

async function deleteMember(tenantId, id) {
  return prisma.member.delete({ where: { id: parseInt(id), tenantId } });
}

module.exports = {
  createMember,
  getAllMembers,
  getMemberById,
  updateMember,
  deleteMember,
};
