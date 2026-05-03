const memberService = require("../services/memberService");

async function createMember(req, res, next) {
  try {
    const member = await memberService.createMember(req.tenantId, req.body);
    res.status(201).json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

async function getAllMembers(req, res, next) {
  try {
    const { membershipId, search } = req.query;
    const members = await memberService.getAllMembers(req.tenantId, { membershipId, search });
    res.json({ success: true, count: members.length, data: members });
  } catch (err) {
    next(err);
  }
}

async function getMemberById(req, res, next) {
  try {
    const member = await memberService.getMemberById(req.tenantId, req.params.id);
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

async function updateMember(req, res, next) {
  try {
    const member = await memberService.updateMember(req.tenantId, req.params.id, req.body);
    res.json({ success: true, data: member });
  } catch (err) {
    next(err);
  }
}

async function deleteMember(req, res, next) {
  try {
    await memberService.deleteMember(req.tenantId, req.params.id);
    res.json({ success: true, message: "Member deleted successfully" });
  } catch (err) {
    next(err);
  }
}

module.exports = { createMember, getAllMembers, getMemberById, updateMember, deleteMember };
