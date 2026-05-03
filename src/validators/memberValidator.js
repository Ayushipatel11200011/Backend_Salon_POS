const { body, param, query } = require('express-validator');

const idParam = param('id')
  .isInt({ min: 1 }).withMessage('id must be a positive integer');

const nameField = body('name')
  .trim()
  .notEmpty().withMessage('name is required')
  .isLength({ min: 2, max: 100 }).withMessage('name must be 2–100 characters');

const phoneField = body('phone')
  .trim()
  .notEmpty().withMessage('phone is required')
  .matches(/^[+\d\s\-()]{7,20}$/).withMessage('phone format is invalid');

const emailField = body('email')
  .optional({ nullable: true })
  .isEmail().withMessage('email must be a valid email address')
  .normalizeEmail();

const dobField = body('dob')
  .optional({ nullable: true })
  .isISO8601().withMessage('dob must be a valid date (YYYY-MM-DD)')
  .custom((val) => {
    if (new Date(val) >= new Date()) throw new Error('dob must be in the past');
    return true;
  });

const membershipIdField = body('membershipId')
  .optional({ nullable: true })
  .isInt({ min: 1 }).withMessage('membershipId must be a positive integer');

const createMemberValidator = [
  nameField,
  phoneField,
  emailField,
  dobField,
  membershipIdField,
  body('startingPoints')
    .optional()
    .isInt({ min: 0 }).withMessage('startingPoints must be a non-negative integer'),
];

const updateMemberValidator = [
  idParam,
  nameField,
  phoneField,
  emailField,
  dobField,
  membershipIdField,
];

const getMembersValidator = [
  query('membershipId')
    .optional()
    .isInt({ min: 1 }).withMessage('membershipId query must be a positive integer'),
  query('search')
    .optional()
    .isString()
    .isLength({ max: 100 }).withMessage('search must not exceed 100 characters'),
];

const idParamValidator = [idParam];

module.exports = {
  createMemberValidator,
  updateMemberValidator,
  getMembersValidator,
  idParamValidator,
};
