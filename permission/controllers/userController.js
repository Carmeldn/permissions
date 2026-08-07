'use strict';

const userService = require('../services/userService');

async function create(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    return res.status(201).json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    return res.json(users.map((u) => u.toSafeJSON()));
  } catch (err) {
    next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    return res.json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    return res.json(user.toSafeJSON());
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Utilisateur introuvable' });
    }
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { create, findAll, findOne, update, remove };
