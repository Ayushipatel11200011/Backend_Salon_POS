const express = require('express');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const tenantMiddleware = require('./middleware/tenantMiddleware');

const tenantRoutes = require('./routes/tenantRoutes');
const memberRoutes = require('./routes/memberRoutes');
const discountRoutes = require('./routes/discountRoutes');
const packageRoutes = require('./routes/packageRoutes');
const membershipRoutes = require('./routes/membershipRoutes');
const loyaltyRoutes = require('./routes/loyaltyRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Tenant management (no tenantMiddleware — used to create/list tenants)
app.use('/api/tenants', tenantRoutes);

// All salon-data routes require x-tenant-id header
app.use('/api/members', tenantMiddleware, memberRoutes);
app.use('/api/discounts', tenantMiddleware, discountRoutes);
app.use('/api/packages', tenantMiddleware, packageRoutes);
app.use('/api/memberships', tenantMiddleware, membershipRoutes);
app.use('/api/loyalty', tenantMiddleware, loyaltyRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
