'use strict';

const { User, RefreshToken, Role, Permission } = require('../models');
const {
  generateAccessToken,
  generateRefreshToken,
  hashToken,
  verifyRefreshToken,
  getRefreshExpiryDate
} = require('../services/tokenService');

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et mot de passe requis' });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Role, as: 'roles', include: [{ model: Permission, as: 'permissions' }] }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    if (user.locked_until && user.locked_until > new Date()) {
      return res.status(423).json({ message: 'Compte temporairement verrouillé, réessayez plus tard' });
    }

    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Compte inactif ou suspendu' });
    }

    const valid = await user.validatePassword(password);
    if (!valid) {
      user.failed_login_attempts += 1;
      if (user.failed_login_attempts >= MAX_FAILED_ATTEMPTS) {
        user.locked_until = new Date(Date.now() + LOCK_DURATION_MINUTES * 60 * 1000);
        user.failed_login_attempts = 0;
      }
      await user.save();
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    user.failed_login_attempts = 0;
    user.locked_until = null;
    user.last_login_at = new Date();
    await user.save();

    const roleNames = user.roles.map((r) => r.name);
    const accessToken = generateAccessToken(user, roleNames);
    const refreshToken = generateRefreshToken(user);

    await RefreshToken.create({
      user_id: user.id,
      token_hash: hashToken(refreshToken),
      user_agent: req.headers['user-agent'] || null,
      ip_address: req.ip,
      expires_at: getRefreshExpiryDate()
    });

    return res.json({
      user: user.toSafeJSON(),
      accessToken,
      refreshToken
    });
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refreshToken requis' });
    }

    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (err) {
      return res.status(401).json({ message: 'Refresh token invalide ou expiré' });
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await RefreshToken.findOne({
      where: { user_id: payload.sub, token_hash: tokenHash }
    });

    if (!stored || stored.revoked) {
      if (stored) {
        await RefreshToken.update({ revoked: true }, { where: { user_id: payload.sub } });
        await User.increment('refresh_token_version', { where: { id: payload.sub } });
      }
      return res.status(401).json({ message: 'Refresh token invalide, reconnexion requise' });
    }

    const user = await User.findByPk(payload.sub, {
      include: [{ model: Role, as: 'roles', include: [{ model: Permission, as: 'permissions' }] }]
    });

    if (!user || user.status !== 'active' || user.refresh_token_version !== payload.v) {
      return res.status(401).json({ message: 'Session invalide, reconnexion requise' });
    }

    stored.revoked = true;
    await stored.save();

    const roleNames = user.roles.map((r) => r.name);
    const newAccessToken = generateAccessToken(user, roleNames);
    const newRefreshToken = generateRefreshToken(user);

    await RefreshToken.create({
      user_id: user.id,
      token_hash: hashToken(newRefreshToken),
      user_agent: req.headers['user-agent'] || null,
      ip_address: req.ip,
      expires_at: getRefreshExpiryDate()
    });

    return res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (refreshToken) {
      await RefreshToken.update(
        { revoked: true },
        { where: { token_hash: hashToken(refreshToken) } }
      );
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function logoutAll(req, res, next) {
  try {
    const userId = req.user.id;
    await RefreshToken.update({ revoked: true }, { where: { user_id: userId } });
    await User.increment('refresh_token_version', { where: { id: userId } });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { login, refresh, logout, logoutAll };
