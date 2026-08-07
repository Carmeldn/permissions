'use strict';

const { verifyAccessToken } = require('../services/tokenService');
const { User, Role, Permission } = require('../models');

/**
 * Vérifie le token d'accès, charge l'utilisateur avec ses rôles et permissions
 * dans req.user. À utiliser sur toute route protégée.
 */
async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Token manquant ou invalide' });
    }

    let payload;
    try {
      payload = verifyAccessToken(token);
    } catch (err) {
      const message = err.name === 'TokenExpiredError' ? 'Token expiré' : 'Token invalide';
      return res.status(401).json({ message });
    }

    const user = await User.findByPk(payload.sub, {
      include: [
        {
          model: Role,
          as: 'roles',
          include: [{ model: Permission, as: 'permissions' }]
        }
      ]
    });

    if (!user || user.status !== 'active') {
      return res.status(401).json({ message: 'Compte introuvable ou inactif' });
    }

    const roleNames = user.roles.map((r) => r.name);
    const permissionCodes = new Set();
    user.roles.forEach((role) => {
      (role.permissions || []).forEach((p) => permissionCodes.add(p.code));
    });

    req.user = user;
    req.userRoles = roleNames;
    req.userPermissions = Array.from(permissionCodes);

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authenticate;
