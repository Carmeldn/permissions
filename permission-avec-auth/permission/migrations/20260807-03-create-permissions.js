'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('permissions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      code: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true // ex: "stock.create", "user.delete", "report.export"
      },
      module: {
        type: Sequelize.STRING(50),
        allowNull: true // ex: "stock", "user", "report" - utile pour grouper dans l'UI admin
      },
      description: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('permissions', ['module']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('permissions');
  }
};
