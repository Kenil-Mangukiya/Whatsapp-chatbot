/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('call_history', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      call_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Unique call identifier'
      },
      agent_id: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: 'Agent identifier'
      },
      agent_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Agent name'
      },
      call_type: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Type of call'
      },
      call_status: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: 'Status of the call'
      },
      duration_ms: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'Call duration in milliseconds'
      },
      start_timestamp: {
        type: Sequelize.BIGINT,
        allowNull: true,
        comment: 'Call start timestamp'
      },
      end_timestamp: {
        type: Sequelize.BIGINT,
        allowNull: true,
        comment: 'Call end timestamp'
      },
      dynamic_variables: {
        type: Sequelize.JSON,
        allowNull: true,
        comment: 'Dynamic variables in JSON format'
      },
      transcript: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Call transcript'
      },
      cost: {
        type: Sequelize.DECIMAL(10, 4),
        allowNull: true,
        comment: 'Call cost'
      },
      recording_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'URL to call recording'
      },
      log_url: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'URL to call logs'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record creation timestamp'
      }
    });

    // Add indexes
    await queryInterface.addIndex('call_history', ['call_id'], {
      name: 'idx_call_history_call_id'
    });
    await queryInterface.addIndex('call_history', ['agent_id'], {
      name: 'idx_call_history_agent_id'
    });
    await queryInterface.addIndex('call_history', ['call_status'], {
      name: 'idx_call_history_call_status'
    });
    await queryInterface.addIndex('call_history', ['start_timestamp'], {
      name: 'idx_call_history_start_timestamp'
    });
    await queryInterface.addIndex('call_history', ['created_at'], {
      name: 'idx_call_history_created_at'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('call_history');
  }
};

