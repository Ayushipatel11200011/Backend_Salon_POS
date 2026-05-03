const { body, param, query } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive integer');

const nameField = body('name')
  .trim()
  .notEmpty().withMessage('name is required')
  .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters');

const priceField = body('price')
  .notEmpty().withMessage('price is required')
  .isFloat({ min: 0 }).withMessage('price must be a non-negative number');

const originalPriceField = body('originalPrice')
  .optional({ nullable: true })
  .isFloat({ min: 0 }).withMessage('originalPrice must be a non-negative number')
  .custom((val, { req }) => {
    if (val && req.body.price && parseFloat(val) <= parseFloat(req.body.price)) {
      throw new Error('originalPrice must be greater than the discounted price');
    }
    return true;
  });

const servicesField = body('services')
  .notEmpty().withMessage('services is required')
  .custom((val) => {
    const arr = Array.isArray(val) ? val : String(val).split(',').map((s) => s.trim());
    if (arr.length === 0) throw new Error('services must have at least one item');
    return true;
  });

const badgeField = body('badge')
  .optional({ nullable: true })
  .isString()
  .isLength({ max: 50 }).withMessage('badge must not exceed 50 characters');

const createPackageValidator = [
  nameField,
  priceField,
  originalPriceField,
  servicesField,
  badgeField,
];

const updatePackageValidator = [
  idParam,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 }).withMessage('price must be a non-negative number'),
  body('originalPrice')
    .optional({ nullable: true })
    .isFloat({ min: 0 }).withMessage('originalPrice must be a non-negative number'),
  body('services')
    .optional()
    .custom((val) => {
      const arr = Array.isArray(val) ? val : String(val).split(',').map((s) => s.trim());
      if (arr.length === 0) throw new Error('services must have at least one item');
      return true;
    }),
  badgeField,
];

const togglePackageValidator = [
  idParam,
  body('isActive')
    .notEmpty().withMessage('isActive is required')
    .isBoolean().withMessage('isActive must be true or false'),
];

const getPackagesValidator = [
  query('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be true or false'),
];

const idParamValidator = [idParam];

module.exports = {
  createPackageValidator,
  updatePackageValidator,
  togglePackageValidator,
  getPackagesValidator,
  idParamValidator,
};
