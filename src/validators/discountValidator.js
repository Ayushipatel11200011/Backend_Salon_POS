const { body, param, query } = require('express-validator');

const DISCOUNT_TYPES = ['PERCENTAGE', 'FLAT', 'BOGO', 'COMBO'];

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive integer');

const nameField = body('name')
  .trim()
  .notEmpty().withMessage('name is required')
  .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters');

const typeField = body('type')
  .trim()
  .notEmpty().withMessage('type is required')
  .toUpperCase()
  .isIn(DISCOUNT_TYPES).withMessage(`type must be one of: ${DISCOUNT_TYPES.join(', ')}`);

const valueField = body('value')
  .notEmpty().withMessage('value is required')
  .isString().withMessage('value must be a string');

const appliesToField = body('appliesTo')
  .notEmpty().withMessage('appliesTo is required')
  .custom((val) => {
    const arr = Array.isArray(val) ? val : [val];
    if (arr.length === 0) throw new Error('appliesTo must have at least one entry');
    return true;
  });

const validFromField = body('validFrom')
  .optional({ nullable: true })
  .isISO8601().withMessage('validFrom must be a valid date (YYYY-MM-DD)');

const validToField = body('validTo')
  .optional({ nullable: true })
  .isISO8601().withMessage('validTo must be a valid date (YYYY-MM-DD)')
  .custom((val, { req }) => {
    if (val && req.body.validFrom && new Date(val) <= new Date(req.body.validFrom)) {
      throw new Error('validTo must be after validFrom');
    }
    return true;
  });

const notesField = body('notes')
  .optional({ nullable: true })
  .isString()
  .isLength({ max: 500 }).withMessage('notes must not exceed 500 characters');

const createDiscountValidator = [
  nameField,
  typeField,
  valueField,
  appliesToField,
  validFromField,
  validToField,
  notesField,
];

const updateDiscountValidator = [
  idParam,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters'),
  body('type')
    .optional()
    .trim()
    .toUpperCase()
    .isIn(DISCOUNT_TYPES).withMessage(`type must be one of: ${DISCOUNT_TYPES.join(', ')}`),
  body('value')
    .optional()
    .isString().withMessage('value must be a string'),
  body('appliesTo')
    .optional()
    .custom((val) => {
      const arr = Array.isArray(val) ? val : [val];
      if (arr.length === 0) throw new Error('appliesTo must have at least one entry');
      return true;
    }),
  validFromField,
  validToField,
  notesField,
];

const toggleDiscountValidator = [
  idParam,
  body('isActive')
    .notEmpty().withMessage('isActive is required')
    .isBoolean().withMessage('isActive must be true or false'),
];

const getDiscountsValidator = [
  query('type')
    .optional()
    .toUpperCase()
    .isIn(DISCOUNT_TYPES).withMessage(`type must be one of: ${DISCOUNT_TYPES.join(', ')}`),
  query('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be true or false'),
];

const idParamValidator = [idParam];

module.exports = {
  createDiscountValidator,
  updateDiscountValidator,
  toggleDiscountValidator,
  getDiscountsValidator,
  idParamValidator,
};
