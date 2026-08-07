'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    await queryInterface.bulkInsert('roles', [
      { name: 'ADMIN', description: 'Accès complet à toutes les fonctionnalités', created_at: now, updated_at: now },
      { name: 'SUPERVISOR', description: 'Gestion et supervision des opérations', created_at: now, updated_at: now },
      { name: 'AGENT', description: 'Opérations courantes limitées à son périmètre', created_at: now, updated_at: now }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('roles', null, {});
  }
};
