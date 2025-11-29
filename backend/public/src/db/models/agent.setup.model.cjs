'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class AgentSetup extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here
      AgentSetup.belongsTo(models.AuthUser, {
        foreignKey: 'auth_user_id',
        as: 'user'
      });
    }
  }
  AgentSetup.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    auth_user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'auth_users',
        key: 'id'
      },
      comment: 'Foreign key to auth_users table'
    },
    agentName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Name of the agent'
    },
    agentVoice: {
      type: DataTypes.ENUM('male', 'female'),
      allowNull: true,
      comment: 'Voice type: male or female'
    },
    agentLanguage: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Language for the agent (e.g., Hindi, English)'
    },
    welcomeMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Welcome message that customer will hear when call starts'
    },
    agentFlow: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Description of agent flow and conversation sequence'
    },
    customerDetails: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Details/information needed from customers'
    },
    transferCall: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'When and how calls should be transferred to human agent'
    },
    endingMessage: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Message that customer will hear when call ends'
    }
  }, {
    sequelize,
    modelName: 'AgentSetup',
    tableName: 'agent_setups',
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['auth_user_id'],
        name: 'agent_setups_auth_user_id_idx'
      }
    ]
  });
  return AgentSetup;
};

