'use strict';

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();
    const permissions = [
      // Users
      { code: 'user.create', module: 'user', description: 'Créer un utilisateur' },
      { code: 'user.read', module: 'user', description: 'Consulter les utilisateurs' },
      { code: 'user.update', module: 'user', description: 'Modifier un utilisateur' },
      { code: 'user.delete', module: 'user', description: 'Supprimer un utilisateur' },
      // Stock
      { code: 'stock.create', module: 'stock', description: 'Créer un mouvement de stock' },
      { code: 'stock.read', module: 'stock', description: 'Consulter le stock' },
      { code: 'stock.update', module: 'stock', description: 'Modifier le stock' },
      { code: 'stock.delete', module: 'stock', description: 'Supprimer un mouvement de stock' },
      // Reports
      { code: 'report.read', module: 'report', description: 'Consulter les rapports' },
      { code: 'report.export', module: 'report', description: 'Exporter les rapports' }
    ].map((p) => ({ ...p, created_at: now, updated_at: now }));

    await queryInterface.bulkInsert('permissions', permissions);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('permissions', null, {});
  }
};
