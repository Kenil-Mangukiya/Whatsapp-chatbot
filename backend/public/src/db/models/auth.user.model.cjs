'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AuthUser extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
    }
  }
  AuthUser.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: false,
      comment: 'Username for authentication'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Email address'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Hashed password (null for OAuth users)'
    },
    avatar: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'Avatar URL from Cloudinary'
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Phone number for OTP authentication'
    }
  }, {
    sequelize,
    modelName: 'AuthUser',
    tableName: 'auth_users',
    timestamps: true,
    indexes: [
      {
        fields: ['email'],
        unique: true
      },
      {
        fields: ['username'],
        unique: false
      },
      {
        fields: ['phoneNumber'],
        unique: true
      }
    ]
  });
  return AuthUser;
};

