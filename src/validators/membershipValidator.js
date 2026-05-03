const { body, param } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive integer');

const nameField = body('name')
  .trim()
  .notEmpty().withMessage('name is required')
  .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters');

const annualFeeField = body('annualFee')
  .notEmpty().withMessage('annualFee is required')
  .isFloat({ min: 0 }).withMessage('annualFee must be a non-negative number');

const discountPctField = body('discountPct')
  .optional()
  .isFloat({ min: 0, max: 100 }).withMessage('discountPct must be between 0 and 100');

const capacityField = body('capacity')
  .optional({ nullable: true })
  .isInt({ min: 1 }).withMessage('capacity must be a positive integer');

const benefitsField = body('benefits')
  .optional({ nullable: true })
  .isString()
  .isLength({ max: 500 }).withMessage('benefits must not exceed 500 characters');

const createMembershipValidator = [
  nameField,
  annualFeeField,
  discountPctField,
  capacityField,
  benefitsField,
];

const updateMembershipValidator = [
  idParam,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters'),
  body('annualFee')
    .optional()
    .isFloat({ min: 0 }).withMessage('annualFee must be a non-negative number'),
  discountPctField,
  capacityField,
  benefitsField,
];

const idParamValidator = [idParam];

module.exports = {
  createMembershipValidator,
  updateMembershipValidator,
  idParamValidator,
};
