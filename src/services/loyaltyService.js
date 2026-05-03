const prisma = require("../utils/prismaClient");

async function getSettings(tenantId) {
  let settings = await prisma.loyaltySettings.findFirst({ where: { tenantId } });
  if (!settings) {
    settings = await prisma.loyaltySettings.create({
      data: {
        tenantId,
        minPointsRedeem: 100,
        conversionRate: 10,
        maxRedeemPerVisit: 500,
      },
    });
  }
  return settings;
}

async function findMember(tenantId, memberId) {
  const member = await prisma.member.findFirst({
    where: { id: parseInt(memberId), tenantId },
  });
  if (!member) {
    const err = new Error("Member not found");
    err.status = 404;
    throw err;
  }
  return member;
}

async function createEarnRule(tenantId, data) {
  const { name, pointsPer, appliesTo, type } = data;
  const VALID_TYPES = ["regular", "bonus", "special"];
  const VALID_APPLIES = ["Services", "Products", "All"];

  if (!VALID_TYPES.includes(type)) {
    const err = new Error(`type must be one of: ${VALID_TYPES.join(", ")}`);
    err.status = 400;
    throw err;
  }
  if (!VALID_APPLIES.includes(appliesTo)) {
    const err = new Error(`appliesTo must be one of: ${VALID_APPLIES.join(", ")}`);
    err.status = 400;
    throw err;
  }

  return prisma.earnRule.create({
    data: { tenantId, name, pointsPer: parseFloat(pointsPer), appliesTo, type, isActive: true },
  });
}

async function getAllEarnRules(tenantId) {
  return prisma.earnRule.findMany({ where: { tenantId }, orderBy: { createdAt: 'asc' } });
}

async function updateEarnRule(tenantId, id, data) {
  return prisma.earnRule.update({
    where: { id: parseInt(id), tenantId },
    data: {
      name: data.name,
      pointsPer: data.pointsPer !== undefined ? parseFloat(data.pointsPer) : undefined,
      appliesTo: data.appliesTo,
      type: data.type,
    },
  });
}

async function toggleEarnRule(tenantId, id, isActive) {
  return prisma.earnRule.update({
    where: { id: parseInt(id), tenantId },
    data: { isActive },
  });
}

async function deleteEarnRule(tenantId, id) {
  return prisma.earnRule.delete({ where: { id: parseInt(id), tenantId } });
}

async function earnPoints(tenantId, { memberId, transactionType, amount, points, description }) {
  const member = await findMember(tenantId, memberId);
  let earnedPoints = 0;

  if (transactionType === "MANUAL" && points) {
    earnedPoints = parseInt(points);
  } else if (transactionType === "REFERRAL") {
    const referralRule = await prisma.earnRule.findFirst({
      where: { tenantId, type: "bonus", appliesTo: "All", isActive: true },
    });
    earnedPoints = referralRule ? referralRule.pointsPer : 500;
  } else if (["SERVICES", "PRODUCTS"].includes(transactionType)) {
    if (!amount || parseFloat(amount) <= 0) {
      const err = new Error("amount is required for SERVICES / PRODUCTS transactions");
      err.status = 400;
      throw err;
    }
    const appliesTo = transactionType === "SERVICES" ? "Services" : "Products";
    const rule = await prisma.earnRule.findFirst({
      where: { tenantId, appliesTo, isActive: true },
      orderBy: { pointsPer: "desc" },
    });
    const rate = rule ? rule.pointsPer : 1;
    earnedPoints = Math.floor((parseFloat(amount) / 10) * rate);
  } else {
    const err = new Error("transactionType must be SERVICES | PRODUCTS | REFERRAL | MANUAL");
    err.status = 400;
    throw err;
  }

  if (earnedPoints <= 0) {
    const err = new Error("Calculated points must be greater than 0");
    err.status = 400;
    throw err;
  }

  const [updatedMember, transaction] = await prisma.$transaction([
    prisma.member.update({
      where: { id: member.id },
      data: { loyaltyPoints: { increment: earnedPoints } },
    }),
    prisma.loyaltyTransaction.create({
      data: {
        memberId: member.id,
        type: "EARN",
        points: earnedPoints,
        source: transactionType,
        description: description || `Earned via ${transactionType}`,
      },
    }),
  ]);

  return {
    member: updatedMember,
    transaction,
    earnedPoints,
    previousPoints: member.loyaltyPoints,
    currentPoints: updatedMember.loyaltyPoints,
  };
}

async function redeemPoints(tenantId, { memberId, pointsToRedeem, description }) {
  const member = await findMember(tenantId, memberId);
  const settings = await getSettings(tenantId);
  const pts = parseInt(pointsToRedeem);

  if (pts < settings.minPointsRedeem) {
    const err = new Error(
      `Minimum ${settings.minPointsRedeem} points required to redeem. You requested ${pts}.`,
    );
    err.status = 400;
    throw err;
  }

  if (pts > member.loyaltyPoints) {
    const err = new Error(
      `Insufficient points. Available: ${member.loyaltyPoints}, Requested: ${pts}`,
    );
    err.status = 400;
    throw err;
  }

  const currencyValue = (pts / 100) * settings.conversionRate;

  if (currencyValue > settings.maxRedeemPerVisit) {
    const maxPoints = Math.floor((settings.maxRedeemPerVisit / settings.conversionRate) * 100);
    const err = new Error(
      `Max redemption per visit is ₹${settings.maxRedeemPerVisit} (${maxPoints} points). ` +
        `You tried to redeem ₹${currencyValue} worth.`,
    );
    err.status = 400;
    throw err;
  }

  const [updatedMember, transaction] = await prisma.$transaction([
    prisma.member.update({
      where: { id: member.id },
      data: { loyaltyPoints: { decrement: pts } },
    }),
    prisma.loyaltyTransaction.create({
      data: {
        memberId: member.id,
        type: "REDEEM",
        points: pts,
        source: "REDEMPTION",
        description: description || `Redeemed ${pts} points for ₹${currencyValue}`,
      },
    }),
  ]);

  return {
    member: updatedMember,
    transaction,
    redeemedPoints: pts,
    currencyValue,
    previousPoints: member.loyaltyPoints,
    currentPoints: updatedMember.loyaltyPoints,
  };
}

async function getLeaderboard(tenantId, limit = 10) {
  const members = await prisma.member.findMany({
    where: { tenantId },
    orderBy: { loyaltyPoints: "desc" },
    take: parseInt(limit),
    select: { id: true, name: true, loyaltyPoints: true },
  });
  return members.map((m, i) => ({ rank: i + 1, ...m }));
}

async function getMemberTransactions(tenantId, memberId, { type, limit = 50 } = {}) {
  await findMember(tenantId, memberId);
  const where = { memberId: parseInt(memberId) };
  if (type) where.type = type.toUpperCase();
  return prisma.loyaltyTransaction.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: parseInt(limit),
  });
}

async function updateSettings(tenantId, { minPointsRedeem, conversionRate, maxRedeemPerVisit, pointsExpiryMonths }) {
  const existing = await getSettings(tenantId);
  return prisma.loyaltySettings.update({
    where: { id: existing.id },
    data: {
      minPointsRedeem: minPointsRedeem !== undefined ? parseInt(minPointsRedeem) : undefined,
      conversionRate: conversionRate !== undefined ? parseFloat(conversionRate) : undefined,
      maxRedeemPerVisit: maxRedeemPerVisit !== undefined ? parseFloat(maxRedeemPerVisit) : undefined,
      pointsExpiryMonths:
        pointsExpiryMonths !== undefined
          ? pointsExpiryMonths === null
            ? null
            : parseInt(pointsExpiryMonths)
          : undefined,
    },
  });
}

module.exports = {
  getSettings,
  updateSettings,
  createEarnRule,
  getAllEarnRules,
  updateEarnRule,
  toggleEarnRule,
  deleteEarnRule,
  earnPoints,
  redeemPoints,
  getLeaderboard,
  getMemberTransactions,
};
