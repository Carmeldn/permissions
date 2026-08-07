'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();

    const roles = await queryInterface.sequelize.query('SELECT id, name FROM roles', {
      type: Sequelize.QueryTypes.SELECT
    });
    const permissions = await queryInterface.sequelize.query('SELECT id, code FROM permissions', {
      type: Sequelize.QueryTypes.SELECT
    });

    const roleId = (name) => roles.find((r) => r.name === name).id;
    const permId = (code) => permissions.find((p) => p.code === code).id;

    const rows = [];

    // ADMIN: toutes les permissions
    permissions.forEach((p) => {
      rows.push({ role_id: roleId('ADMIN'), permission_id: p.id, created_at: now });
    });

    // SUPERVISOR: lecture/écriture stock + rapports, lecture users
    [
      'user.read',
      'stock.create',
      'stock.read',
      'stock.update',
      'report.read',
      'report.export'
    ].forEach((code) => {
      rows.push({ role_id: roleId('SUPERVISOR'), permission_id: permId(code), created_at: now });
    });

    // AGENT: opérations de stock basiques uniquement
    ['stock.create', 'stock.read'].forEach((code) => {
      rows.push({ role_id: roleId('AGENT'), permission_id: permId(code), created_at: now });
    });

    await queryInterface.bulkInsert('role_permissions', rows);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('role_permissions', null, {});
  }
};
