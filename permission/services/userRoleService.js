'use strict';

const { User, Role, UserRole } = require('../models');

async function assignRoleToUser(userId, roleId) {
  const user = await User.findByPk(userId);
  const role = await Role.findByPk(roleId);
  if (!user || !role) return null;

  const [userRole] = await UserRole.findOrCreate({
    where: { user_id: userId, role_id: roleId }
  });
  return userRole;
}

async function removeRoleFromUser(userId, roleId) {
  const deleted = await UserRole.destroy({
    where: { user_id: userId, role_id: roleId }
  });
  return deleted > 0;
}

async function getRolesForUser(userId) {
  const user = await User.findByPk(userId, {
    include: [{ model: Role, as: 'roles' }]
  });
  if (!user) return null;
  return user.roles;
}

async function getAllUserRoles() {
  return UserRole.findAll();
}

module.exports = {
  assignRoleToUser,
  removeRoleFromUser,
  getRolesForUser,
  getAllUserRoles
};
