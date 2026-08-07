'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RefreshToken extends Model {
    static associate(models) {
      RefreshToken.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  RefreshToken.init(
    {
      user_id: { type: DataTypes.INTEGER, allowNull: false },
      token_hash: { type: DataTypes.STRING(255), allowNull: false },
      user_agent: DataTypes.STRING(255),
      ip_address: DataTypes.STRING(45),
      revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
      expires_at: { type: DataTypes.DATE, allowNull: false }
    },
    {
      sequelize,
      modelName: 'RefreshToken',
      tableName: 'refresh_tokens',
      underscored: true,
      updatedAt: false
    }
  );

  return RefreshToken;
};
