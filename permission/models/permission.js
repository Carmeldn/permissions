'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Permission extends Model {
    static associate(models) {
      Permission.belongsToMany(models.Role, {
        through: models.RolePermission,
        foreignKey: 'permission_id',
        otherKey: 'role_id',
        as: 'roles'
      });
    }
  }

  Permission.init(
    {
      code: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true
      },
      module: DataTypes.STRING(50),
      description: DataTypes.STRING(255)
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'permissions',
      underscored: true
    }
  );

  return Permission;
};
