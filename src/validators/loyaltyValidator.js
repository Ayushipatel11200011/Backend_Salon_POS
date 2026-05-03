const { body, param, query } = require('express-validator');

const APPLIES_TO_VALUES = ['Services', 'Products', 'All'];
const RULE_TYPES = ['regular', 'bonus', 'special'];
const TRANSACTION_TYPES = ['SERVICES', 'PRODUCTS', 'REFERRAL', 'MANUAL'];

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive integer');

const memberIdParam = param('memberId')
  .isInt({ min: 1 }).withMessage('memberId must be a positive integer');

const memberIdBody = body('memberId')
  .notEmpty().withMessage('memberId is required')
  .isInt({ min: 1 }).withMessage('memberId must be a positive integer');

const descriptionField = body('description')
  .optional({ nullable: true })
  .isString()
  .isLength({ max: 255 }).withMessage('description must not exceed 255 characters');


const updateSettingsValidator = [
  body('minPointsRedeem')
    .optional()
    .isInt({ min: 1 }).withMessage('minPointsRedeem must be a positive integer'),
  body('conversionRate')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('conversionRate must be a positive number'),
  body('maxRedeemPerVisit')
    .optional()
    .isFloat({ min: 1 }).withMessage('maxRedeemPerVisit must be a positive number'),
  body('pointsExpiryMonths')
    .optional({ nullable: true })
    .custom((val) => {
      if (val !== null && (!Number.isInteger(Number(val)) || Number(val) < 1)) {
        throw new Error('pointsExpiryMonths must be a positive integer or null');
      }
      return true;
    }),
];


const createEarnRuleValidator = [
  body('name')
    .trim()
    .notEmpty().withMessage('name is required')
    .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters'),
  body('pointsPer')
    .notEmpty().withMessage('pointsPer is required')
    .isFloat({ min: 0.1 }).withMessage('pointsPer must be greater than 0'),
  body('appliesTo')
    .notEmpty().withMessage('appliesTo is required')
    .isIn(APPLIES_TO_VALUES).withMessage(`appliesTo must be one of: ${APPLIES_TO_VALUES.join(', ')}`),
  body('type')
    .notEmpty().withMessage('type is required')
    .isIn(RULE_TYPES).withMessage(`type must be one of: ${RULE_TYPES.join(', ')}`),
];

const updateEarnRuleValidator = [
  idParam,
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters'),
  body('pointsPer')
    .optional()
    .isFloat({ min: 0.1 }).withMessage('pointsPer must be greater than 0'),
  body('appliesTo')
    .optional()
    .isIn(APPLIES_TO_VALUES).withMessage(`appliesTo must be one of: ${APPLIES_TO_VALUES.join(', ')}`),
  body('type')
    .optional()
    .isIn(RULE_TYPES).withMessage(`type must be one of: ${RULE_TYPES.join(', ')}`),
];

const toggleEarnRuleValidator = [
  idParam,
  body('isActive')
    .notEmpty().withMessage('isActive is required')
    .isBoolean().withMessage('isActive must be true or false'),
];

const idParamValidator = [idParam];


const earnPointsValidator = [
  memberIdBody,
  body('transactionType')
    .notEmpty().withMessage('transactionType is required')
    .toUpperCase()
    .isIn(TRANSACTION_TYPES).withMessage(`transactionType must be one of: ${TRANSACTION_TYPES.join(', ')}`),
  body('amount')
    .if(body('transactionType').isIn(['SERVICES', 'PRODUCTS']))
    .notEmpty().withMessage('amount is required for SERVICES and PRODUCTS')
    .isFloat({ min: 1 }).withMessage('amount must be a positive number'),
  body('points')
    .if(body('transactionType').equals('MANUAL'))
    .notEmpty().withMessage('points is required for MANUAL transactions')
    .isInt({ min: 1 }).withMessage('points must be a positive integer'),
  descriptionField,
];


const redeemPointsValidator = [
  memberIdBody,
  body('pointsToRedeem')
    .notEmpty().withMessage('pointsToRedeem is required')
    .isInt({ min: 1 }).withMessage('pointsToRedeem must be a positive integer'),
  descriptionField,
];


const leaderboardValidator = [
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 }).withMessage('limit must be between 1 and 100'),
];


const transactionsValidator = [
  memberIdParam,
  query('type')
    .optional()
    .toUpperCase()
    .isIn(['EARN', 'REDEEM']).withMessage('type must be EARN or REDEEM'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 200 }).withMessage('limit must be between 1 and 200'),
];

module.exports = {
  updateSettingsValidator,
  createEarnRuleValidator,
  updateEarnRuleValidator,
  toggleEarnRuleValidator,
  idParamValidator,
  earnPointsValidator,
  redeemPointsValidator,
  leaderboardValidator,
  transactionsValidator,
};
