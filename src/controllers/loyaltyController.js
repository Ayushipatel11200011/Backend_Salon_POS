const loyaltyService = require('../services/loyaltyService');

async function createEarnRule(req, res, next) {
  try {
    const rule = await loyaltyService.createEarnRule(req.tenantId, req.body);
    res.status(201).json({ success: true, data: rule });
  } catch (err) {
    next(err);
  }
}

async function getAllEarnRules(req, res, next) {
  try {
    const rules = await loyaltyService.getAllEarnRules(req.tenantId);
    res.json({ success: true, count: rules.length, data: rules });
  } catch (err) {
    next(err);
  }
}

async function updateEarnRule(req, res, next) {
  try {
    const rule = await loyaltyService.updateEarnRule(req.tenantId, req.params.id, req.body);
    res.json({ success: true, data: rule });
  } catch (err) {
    next(err);
  }
}

async function toggleEarnRule(req, res, next) {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }
    const rule = await loyaltyService.toggleEarnRule(req.tenantId, req.params.id, isActive);
    res.json({ success: true, data: rule });
  } catch (err) {
    next(err);
  }
}

async function deleteEarnRule(req, res, next) {
  try {
    await loyaltyService.deleteEarnRule(req.tenantId, req.params.id);
    res.json({ success: true, message: 'Earn rule deleted successfully' });
  } catch (err) {
    next(err);
  }
}

async function earnPoints(req, res, next) {
  try {
    const result = await loyaltyService.earnPoints(req.tenantId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function redeemPoints(req, res, next) {
  try {
    const result = await loyaltyService.redeemPoints(req.tenantId, req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

async function getLeaderboard(req, res, next) {
  try {
    const { limit } = req.query;
    const leaderboard = await loyaltyService.getLeaderboard(req.tenantId, limit);
    res.json({ success: true, count: leaderboard.length, data: leaderboard });
  } catch (err) {
    next(err);
  }
}

async function getMemberTransactions(req, res, next) {
  try {
    const { type, limit } = req.query;
    const transactions = await loyaltyService.getMemberTransactions(req.tenantId, req.params.memberId, { type, limit });
    res.json({ success: true, count: transactions.length, data: transactions });
  } catch (err) {
    next(err);
  }
}

async function getSettings(req, res, next) {
  try {
    const settings = await loyaltyService.getSettings(req.tenantId);
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

async function updateSettings(req, res, next) {
  try {
    const settings = await loyaltyService.updateSettings(req.tenantId, req.body);
    res.json({ success: true, data: settings });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createEarnRule,
  getAllEarnRules,
  updateEarnRule,
  toggleEarnRule,
  deleteEarnRule,
  earnPoints,
  redeemPoints,
  getLeaderboard,
  getMemberTransactions,
  getSettings,
  updateSettings,
};
