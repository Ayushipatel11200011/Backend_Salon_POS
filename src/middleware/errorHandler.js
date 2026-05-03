const { validationResult } = require('express-validator');

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
}

function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
}

function errorHandler(err, req, res, next) {
  console.error(err);

  if (err.code === 'P2002') {
    const rawTarget = err.meta?.driverAdapterError?.cause?.constraint?.fields;
    let conflictFields = [];

    if (Array.isArray(rawTarget)) {
      conflictFields = rawTarget;
    } else if (typeof rawTarget === 'string') {
      const normalized = rawTarget.replace(/['"\[\]]/g, '');
      conflictFields = normalized.split(/[,\s]+/).filter(Boolean);
    }

    const targetString = String(rawTarget || '').toLowerCase();
    const hasPhone = conflictFields.includes('phone') || targetString.includes('phone');

    let message = 'A record with this already exists';

    if (hasPhone) {
      message = 'A record with this phone number already exists';
    }else if (conflictFields.length) {
      message = `A record with this ${conflictFields.join(', ')} already exists`;
    }

    return res.status(409).json({
      success: false,
      message,
    });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ success: false, message: 'Record not found' });
  }

  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || 'Internal server error',
  });
}

module.exports = { validate, notFound, errorHandler };
