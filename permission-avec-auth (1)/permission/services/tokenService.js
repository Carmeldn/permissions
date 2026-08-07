'use strict';

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || '15m';
const REFRESH_EXPIRES_IN_DAYS = Number(process.env.JWT_REFRESH_EXPIRES_DAYS || 30);

function generateAccessToken(user, roleNames) {
  return jwt.sign(
    {
      sub: user.id,
      roles: roleNames
    },
    ACCESS_SECRET,
    { expiresIn: ACCESS_EXPIRES_IN }
  );
}

function generateRefreshToken(user) {
  const raw = crypto.randomBytes(48).toString('hex');
  return jwt.sign(
    {
      sub: user.id,
      v: user.refresh_token_version,
      jti: raw
    },
    REFRESH_SECRET,
    { expiresIn: `${REFRESH_EXPIRES_IN_DAYS}d` }
  );
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_SECRET);
}

function getRefreshExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + REFRESH_EXPIRES_IN_DAYS);
  return d;
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyAccessToken,
  verifyRefreshToken,
  getRefreshExpiryDate
};
