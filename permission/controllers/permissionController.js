'use strict';

const permissionService = require('../services/permissionService');

async function create(req, res, next) {
  try {
    const permission = await permissionService.createPermission(req.body);
    return res.status(201).json(permission);
  } catch (err) {
    next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const permissions = await permissionService.getAllPermissions();
    return res.json(permissions);
  } catch (err) {
    next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const permission = await permissionService.getPermissionById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission introuvable' });
    }
    return res.json(permission);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const permission = await permissionService.updatePermission(req.params.id, req.body);
    if (!permission) {
      return res.status(404).json({ message: 'Permission introuvable' });
    }
    return res.json(permission);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await permissionService.deletePermission(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Permission introuvable' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, findAll, findOne, update, remove };
