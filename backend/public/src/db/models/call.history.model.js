'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CallHistory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // Define associations here if needed
    }
  }
  CallHistory.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    call_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Unique call identifier'
    },
    agent_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: 'Agent identifier'
    },
    agent_name: {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: 'Agent name'
    },
    call_type: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Type of call'
    },
    call_status: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Status of the call'
    },
    duration_ms: {
      type: DataTypes.INTEGER,
      allowNull: true,
      comment: 'Call duration in milliseconds'
    },
    start_timestamp: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Call start timestamp'
    },
    end_timestamp: {
      type: DataTypes.BIGINT,
      allowNull: true,
      comment: 'Call end timestamp'
    },
    dynamic_variables: {
      type: DataTypes.JSON,
      allowNull: true,
      comment: 'Dynamic variables in JSON format'
    },
    transcript: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Call transcript'
    },
    cost: {
      type: DataTypes.DECIMAL(10, 4),
      allowNull: true,
      comment: 'Call cost'
    },
    recording_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to call recording'
    },
    log_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
      comment: 'URL to call logs'
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
      comment: 'Record creation timestamp'
    }
  }, {
    sequelize,
    modelName: 'CallHistory',
    tableName: 'call_history',
    timestamps: false, // We're using created_at manually
    indexes: [
      {
        fields: ['call_id']
      },
      {
        fields: ['agent_id']
      },
      {
        fields: ['call_status']
      },
      {
        fields: ['start_timestamp']
      },
      {
        fields: ['created_at']
      }
    ]
  });
  return CallHistory;
};

