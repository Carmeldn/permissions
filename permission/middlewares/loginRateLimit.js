'use strict';

const rateLimit = require('express-rate-limit');

// Limite les tentatives de login par IP: 10 essais / 15 minutes
const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Trop de tentatives de connexion, réessayez plus tard' }
});

module.exports = loginRateLimit;
