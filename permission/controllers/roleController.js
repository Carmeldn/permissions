'use strict';

const roleService = require('../services/roleService');

async function create(req, res, next) {
  try {
    const role = await roleService.createRole(req.body);
    return res.status(201).json(role);
  } catch (err) {
    next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const roles = await roleService.getAllRoles();
    return res.json(roles);
  } catch (err) {
    next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const role = await roleService.getRoleById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Rôle introuvable' });
    }
    return res.json(role);
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const role = await roleService.updateRole(req.params.id, req.body);
    if (!role) {
      return res.status(404).json({ message: 'Rôle introuvable' });
    }
    return res.json(role);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await roleService.deleteRole(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Rôle introuvable' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, findAll, findOne, update, remove };
