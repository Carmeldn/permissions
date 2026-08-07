'use strict';

/**
 * Exige une (ou plusieurs) permission(s) précise(s).
 * Usage: requirePermission('stock.create')
 * Usage: requirePermission(['stock.create', 'stock.update'], { mode: 'any' })
 */
function requirePermission(permissions, options = {}) {
  const required = Array.isArray(permissions) ? permissions : [permissions];
  const mode = options.mode || 'all';

  return (req, res, next) => {
    if (!req.userPermissions) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const has = (perm) => req.userPermissions.includes(perm);
    const ok = mode === 'any' ? required.some(has) : required.every(has);

    if (!ok) {
      return res.status(403).json({ message: 'Permission refusée', required });
    }

    next();
  };
}

/**
 * Raccourci basé sur le nom du rôle, pour les cas simples.
 * Usage: requireRole('ADMIN')
 * Usage: requireRole(['ADMIN', 'SUPERVISOR'])
 */
function requireRole(roles) {
  const allowed = Array.isArray(roles) ? roles : [roles];

  return (req, res, next) => {
    if (!req.userRoles) {
      return res.status(401).json({ message: 'Non authentifié' });
    }

    const ok = req.userRoles.some((r) => allowed.includes(r));
    if (!ok) {
      return res.status(403).json({ message: 'Rôle non autorisé', allowed });
    }

    next();
  };
}

/**
 * Vérifie que la ressource ciblée appartient bien à l'utilisateur courant
 * (ou que l'utilisateur a une permission qui outrepasse cette contrainte).
 */
function requireOwnership(resourceLoader, { ownerField = 'user_id', bypassPermission = null } = {}) {
  return async (req, res, next) => {
    try {
      if (bypassPermission && req.userPermissions && req.userPermissions.includes(bypassPermission)) {
        return next();
      }

      const resource = await resourceLoader(req);
      if (!resource) {
        return res.status(404).json({ message: 'Ressource introuvable' });
      }

      if (resource[ownerField] !== req.user.id) {
        return res.status(403).json({ message: 'Accès refusé à cette ressource' });
      }

      req.resource = resource;
      next();
    } catch (err) {
      next(err);
    }
  };
}

module.exports = { requirePermission, requireRole, requireOwnership };
