'use strict';

const { Permission } = require('../models');

async function createPermission(data) {
  return Permission.create(data);
}

async function getAllPermissions() {
  return Permission.findAll();
}

async function getPermissionById(id) {
  return Permission.findByPk(id);
}

async function updatePermission(id, data) {
  const permission = await Permission.findByPk(id);
  if (!permission) return null;
  await permission.update(data);
  return permission;
}

async function deletePermission(id) {
  const permission = await Permission.findByPk(id);
  if (!permission) return null;
  await permission.destroy();
  return true;
}

module.exports = {
  createPermission,
  getAllPermissions,
  getPermissionById,
  updatePermission,
  deletePermission
};
