const tenantService = require('../services/tenantService');

async function createTenant(req, res, next) {
  try {
    const tenant = await tenantService.createTenant(req.body);
    res.status(201).json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
}

async function getAllTenants(req, res, next) {
  try {
    const tenants = await tenantService.getAllTenants();
    res.json({ success: true, count: tenants.length, data: tenants });
  } catch (err) {
    next(err);
  }
}

async function getTenantById(req, res, next) {
  try {
    const tenant = await tenantService.getTenantById(req.params.id);
    res.json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
}

async function updateTenant(req, res, next) {
  try {
    const tenant = await tenantService.updateTenant(req.params.id, req.body);
    res.json({ success: true, data: tenant });
  } catch (err) {
    next(err);
  }
}

module.exports = { createTenant, getAllTenants, getTenantById, updateTenant };
