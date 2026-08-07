'use strict';

const { User, Role, Permission } = require('../models');

async function createUser(data) {
  // password_hash est hashé automatiquement par le hook beforeCreate du modèle
  return User.create(data);
}

async function getAllUsers() {
  return User.findAll({
    include: [{ model: Role, as: 'roles' }]
  });
}

async function getUserById(id) {
  return User.findByPk(id, {
    include: [{ model: Role, as: 'roles', include: [{ model: Permission, as: 'permissions' }] }]
  });
}

async function updateUser(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.update(data);
  return user;
}

async function deleteUser(id) {
  const user = await User.findByPk(id);
  if (!user) return null;
  await user.destroy();
  return true;
}

module.exports = { createUser, getAllUsers, getUserById, updateUser, deleteUser };
