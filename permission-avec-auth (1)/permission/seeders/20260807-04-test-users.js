'use strict';

const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const now = new Date();
    const passwordHash = await bcrypt.hash('Password123!', 12);

    await queryInterface.bulkInsert('users', [
      {
        email: 'admin@test.local',
        password_hash: passwordHash,
        first_name: 'Alice',
        last_name: 'Admin',
        status: 'active',
        created_at: now,
        updated_at: now
      },
      {
        email: 'supervisor@test.local',
        password_hash: passwordHash,
        first_name: 'Sam',
        last_name: 'Superviseur',
        status: 'active',
        created_at: now,
        updated_at: now
      },
      {
        email: 'agent@test.local',
        password_hash: passwordHash,
        first_name: 'Amina',
        last_name: 'Agent',
        status: 'active',
        created_at: now,
        updated_at: now
      }
    ]);

    const users = await queryInterface.sequelize.query('SELECT id, email FROM users', {
      type: Sequelize.QueryTypes.SELECT
    });
    const roles = await queryInterface.sequelize.query('SELECT id, name FROM roles', {
      type: Sequelize.QueryTypes.SELECT
    });

    const userId = (email) => users.find((u) => u.email === email).id;
    const roleId = (name) => roles.find((r) => r.name === name).id;

    await queryInterface.bulkInsert('user_roles', [
      { user_id: userId('admin@test.local'), role_id: roleId('ADMIN'), created_at: now },
      { user_id: userId('supervisor@test.local'), role_id: roleId('SUPERVISOR'), created_at: now },
      { user_id: userId('agent@test.local'), role_id: roleId('AGENT'), created_at: now }
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_roles', null, {});
    await queryInterface.bulkDelete('users', null, {});
  }
};
