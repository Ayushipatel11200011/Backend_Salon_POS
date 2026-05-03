const packageService = require('../services/packageService');

async function createPackage(req, res, next) {
  try {
    const pkg = await packageService.createPackage(req.tenantId, req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
}

async function getAllPackages(req, res, next) {
  try {
    const { isActive } = req.query;
    const packages = await packageService.getAllPackages(req.tenantId, { isActive });
    res.json({ success: true, count: packages.length, data: packages });
  } catch (err) {
    next(err);
  }
}

async function getActivePackages(req, res, next) {
  try {
    const packages = await packageService.getActivePackages(req.tenantId);
    res.json({ success: true, count: packages.length, data: packages });
  } catch (err) {
    next(err);
  }
}

async function getPackageById(req, res, next) {
  try {
    const pkg = await packageService.getPackageById(req.tenantId, req.params.id);
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
}

async function updatePackage(req, res, next) {
  try {
    const pkg = await packageService.updatePackage(req.tenantId, req.params.id, req.body);
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
}

async function togglePackage(req, res, next) {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }
    const pkg = await packageService.togglePackage(req.tenantId, req.params.id, isActive);
    res.json({ success: true, data: pkg });
  } catch (err) {
    next(err);
  }
}

async function deletePackage(req, res, next) {
  try {
    await packageService.deletePackage(req.tenantId, req.params.id);
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createPackage, getAllPackages, getActivePackages, getPackageById, updatePackage, togglePackage, deletePackage };
