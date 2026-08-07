'use strict';

const rolePermissionService = require('../services/rolePermissionService');

async function assign(req, res, next) {
  try {
    const { roleId, permissionId } = req.body;
    const rolePermission = await rolePermissionService.assignPermissionToRole(roleId, permissionId);
    if (!rolePermission) {
      return res.status(404).json({ message: 'Rôle ou permission introuvable' });
    }
    return res.status(201).json(rolePermission);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { roleId, permissionId } = req.body;
    const removed = await rolePermissionService.removePermissionFromRole(roleId, permissionId);
    if (!removed) {
      return res.status(404).json({ message: 'Association rôle/permission introuvable' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

async function findForRole(req, res, next) {
  try {
    const permissions = await rolePermissionService.getPermissionsForRole(req.params.roleId);
    if (permissions === null) {
      return res.status(404).json({ message: 'Rôle introuvable' });
    }
    return res.json(permissions);
  } catch (err) {
    next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const rolePermissions = await rolePermissionService.getAllRolePermissions();
    return res.json(rolePermissions);
  } catch (err) {
    next(err);
  }
}

module.exports = { assign, remove, findForRole, findAll };
