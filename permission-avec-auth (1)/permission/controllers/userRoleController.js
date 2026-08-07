'use strict';

const userRoleService = require('../services/userRoleService');

async function assign(req, res, next) {
  try {
    const { userId, roleId } = req.body;
    const userRole = await userRoleService.assignRoleToUser(userId, roleId);
    if (!userRole) {
      return res.status(404).json({ message: 'Utilisateur ou rôle introuvable' });
    }
    return res.status(201).json(userRole);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { userId, roleId } = req.body;
    const removed = await userRoleService.removeRoleFromUser(userId, roleId);
    if (!removed) {
      return res.status(404).json({ message: 'Association utilisateur/rôle introuvable' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function findForUser(req, res, next) {
  try {
    const roles = await userRoleService.getRolesForUser(req.params.userId);
    if (roles === null) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    return res.json(roles);
  } catch (err) {
    next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const userRoles = await userRoleService.getAllUserRoles();
    return res.json(userRoles);
  } catch (err) {
    next(err);
  }
}

module.exports = { assign, remove, findForUser, findAll };
