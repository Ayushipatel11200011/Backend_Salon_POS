const discountService = require('../services/discountService');

async function createDiscount(req, res, next) {
  try {
    const discount = await discountService.createDiscount(req.tenantId, req.body);
    res.status(201).json({ success: true, data: discount });
  } catch (err) {
    next(err);
  }
}

async function getAllDiscounts(req, res, next) {
  try {
    const { type, isActive } = req.query;
    const discounts = await discountService.getAllDiscounts(req.tenantId, { type, isActive });
    res.json({ success: true, count: discounts.length, data: discounts });
  } catch (err) {
    next(err);
  }
}

async function getActiveDiscounts(req, res, next) {
  try {
    const discounts = await discountService.getActiveDiscounts(req.tenantId);
    res.json({ success: true, count: discounts.length, data: discounts });
  } catch (err) {
    next(err);
  }
}

async function getDiscountById(req, res, next) {
  try {
    const discount = await discountService.getDiscountById(req.tenantId, req.params.id);
    res.json({ success: true, data: discount });
  } catch (err) {
    next(err);
  }
}

async function updateDiscount(req, res, next) {
  try {
    const discount = await discountService.updateDiscount(req.tenantId, req.params.id, req.body);
    res.json({ success: true, data: discount });
  } catch (err) {
    next(err);
  }
}

async function toggleDiscount(req, res, next) {
  try {
    const { isActive } = req.body;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ success: false, message: 'isActive must be a boolean' });
    }
    const discount = await discountService.toggleDiscount(req.tenantId, req.params.id, isActive);
    res.json({ success: true, data: discount });
  } catch (err) {
    next(err);
  }
}

async function deleteDiscount(req, res, next) {
  try {
    await discountService.deleteDiscount(req.tenantId, req.params.id);
    res.json({ success: true, message: 'Discount deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { createDiscount, getAllDiscounts, getActiveDiscounts, getDiscountById, updateDiscount, toggleDiscount, deleteDiscount };
