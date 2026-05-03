const membershipService = require('../services/membershipService');

async function createMembership(req, res, next) {
  try {
    const membership = await membershipService.createMembership(req.tenantId, req.body);
    res.status(201).json({ success: true, data: membership });
  } catch (err) {
    next(err);
  }
}

async function getAllMemberships(req, res, next) {
  try {
    const memberships = await membershipService.getAllMemberships(req.tenantId);
    res.json({ success: true, count: memberships.length, data: memberships });
  } catch (err) {
    next(err);
  }
}

async function getMembershipById(req, res, next) {
  try {
    const membership = await membershipService.getMembershipById(req.tenantId, req.params.id);
    res.json({ success: true, data: membership });
  } catch (err) {
    next(err);
  }
}

async function updateMembership(req, res, next) {
  try {
    const membership = await membershipService.updateMembership(req.tenantId, req.params.id, req.body);
    res.json({ success: true, data: membership });
  } catch (err) {
    next(err);
  }
}

async function deleteMembership(req, res, next) {
  try {
    await membershipService.deleteMembership(req.tenantId, req.params.id);
    res.json({ success: true, message: 'Membership deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createMembership, getAllMemberships, getMembershipById, updateMembership, deleteMembership };
