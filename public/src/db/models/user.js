'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // User has many conversations
      User.hasMany(models.Conversation, {
        foreignKey: 'user_id',
        as: 'conversations'
      });
    }
  }
  User.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    phoneNumber: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: 'WhatsApp phone number'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Contact name from WhatsApp'
    },
    whatsapp_id: {
      type: DataTypes.STRING(20),
      allowNull: true,
      comment: 'WhatsApp ID (wa_id)'
    },
    lastMessageAt: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: 'Last message timestamp'
    },
    firstContactAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'First contact timestamp'
    },
    totalMessages: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: 'Total messages count'
    },
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
    indexes: [
      {
        fields: ['phoneNumber']
      },
      {
        fields: ['whatsapp_id']
      },
      {
        fields: ['lastMessageAt']
      }
    ]
  });
  return User;
};