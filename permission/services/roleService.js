'use strict';

const { Role, Permission } = require('../models');

async function createRole(data) {
  return Role.create(data);
}

async function getAllRoles() {
  return Role.findAll({
    include: [{ model: Permission, as: 'permissions' }]
  });
}

async function getRoleById(id) {
  return Role.findByPk(id, {
    include: [{ model: Permission, as: 'permissions' }]
  });
}

async function updateRole(id, data) {
  const role = await Role.findByPk(id);
  if (!role) return null;
  await role.update(data);
  return role;
}

async function deleteRole(id) {
  const role = await Role.findByPk(id);
  if (!role) return null;
  await role.destroy();
  return true;
}

module.exports = { createRole, getAllRoles, getRoleById, updateRole, deleteRole };
