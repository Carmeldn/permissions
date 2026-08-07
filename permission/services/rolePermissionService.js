'use strict';

const { Role, Permission, RolePermission } = require('../models');

async function assignPermissionToRole(roleId, permissionId) {
  const role = await Role.findByPk(roleId);
  const permission = await Permission.findByPk(permissionId);
  if (!role || !permission) return null;

  const [rolePermission] = await RolePermission.findOrCreate({
    where: { role_id: roleId, permission_id: permissionId }
  });
  return rolePermission;
}

async function removePermissionFromRole(roleId, permissionId) {
  const deleted = await RolePermission.destroy({
    where: { role_id: roleId, permission_id: permissionId }
  });
  return deleted > 0;
}

async function getPermissionsForRole(roleId) {
  const role = await Role.findByPk(roleId, {
    include: [{ model: Permission, as: 'permissions' }]
  });
  if (!role) return null;
  return role.permissions;
}

async function getAllRolePermissions() {
  return RolePermission.findAll();
}

module.exports = {
  assignPermissionToRole,
  removePermissionFromRole,
  getPermissionsForRole,
  getAllRolePermissions
};
