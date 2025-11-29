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
      allowNull: true,
      unique: false,
      comment: 'Username for authentication (optional)'
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: true,
      unique: false,
      comment: 'Email address (optional)'
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Phone number for OTP authentication'
    },
    // Business Details
    businessName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Business name'
    },
    fullName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Full name of the business owner'
    },
    businessSize: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Business size (e.g., 1-5, 6-20, etc.)'
    },
    serviceArea: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Primary service area'
    },
    // Business Hours
    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: 'Business start time'
    },
    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
      comment: 'Business end time'
    },
    // Pricing Setup (stored as JSON)
    vehicleTypes: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Vehicle types with services and pricing (JSON array)'
    },
    // Assigned Phone Number (for admin assignment)
    assignedPhoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Assigned phone number for business operations'
    },
    // User Role
    role: {
      type: DataTypes.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
      comment: 'User role: user (regular) or admin'
    }
  }, {
    sequelize,
    modelName: 'AuthUser',
    tableName: 'auth_users',
    timestamps: true,
    indexes: [
      {
        fields: ['phoneNumber'],
        unique: true
      },
      {
        fields: ['email'],
        unique: false
      }
    ]
  });
  return AuthUser;
};

