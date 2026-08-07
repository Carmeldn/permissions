'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Role, {
        through: models.UserRole,
        foreignKey: 'user_id',
        otherKey: 'role_id',
        as: 'roles'
      });
      User.hasMany(models.RefreshToken, {
        foreignKey: 'user_id',
        as: 'refreshTokens'
      });
    }

    async validatePassword(plainPassword) {
      return bcrypt.compare(plainPassword, this.password_hash);
    }

    // Charge à plat toutes les permissions de l'utilisateur (via ses rôles)
    async getAllPermissions() {
      const roles = await this.getRoles({
        include: [{ association: 'permissions' }]
      });
      const codes = new Set();
      roles.forEach(role => {
        (role.permissions || []).forEach(p => codes.add(p.code));
      });
      return Array.from(codes);
    }

    toSafeJSON() {
      const { password_hash, ...safe } = this.toJSON();
      return safe;
    }
  }

  User.init(
    {
      email: {
        type: DataTypes.STRING(150),
        allowNull: false,
        unique: true,
        validate: { isEmail: true }
      },
      password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false
      },
      first_name: DataTypes.STRING(100),
      last_name: DataTypes.STRING(100),
      status: {
        type: DataTypes.ENUM('active', 'suspended', 'pending'),
        allowNull: false,
        defaultValue: 'pending'
      },
      failed_login_attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      locked_until: DataTypes.DATE,
      refresh_token_version: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      last_login_at: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'users',
      underscored: true,
      hooks: {
        beforeCreate: async (user) => {
          if (user.password_hash) {
            user.password_hash = await bcrypt.hash(user.password_hash, 12);
          }
        },
        beforeUpdate: async (user) => {
          if (user.changed('password_hash')) {
            user.password_hash = await bcrypt.hash(user.password_hash, 12);
          }
        }
      }
    }
  );

  return User;
};
