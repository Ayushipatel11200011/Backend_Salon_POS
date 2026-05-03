function tenantMiddleware(req, res, next) {
  const raw = req.headers['x-tenant-id'];
  const tenantId = parseInt(raw);
  if (!raw || isNaN(tenantId) || tenantId <= 0) {
    return res.status(400).json({ success: false, message: 'x-tenant-id header is required and must be a valid tenant ID' });
  }
  req.tenantId = tenantId;
  next();
}

module.exports = tenantMiddleware;
