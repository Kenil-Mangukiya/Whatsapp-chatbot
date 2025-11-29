'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('agent_setups', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      auth_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'auth_users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
        comment: 'Foreign key to auth_users table'
      },
      agentName: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Name of the agent'
      },
      agentVoice: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: true,
        comment: 'Voice type: male or female'
      },
      agentLanguage: {
        type: Sequelize.STRING(100),
        allowNull: true,
        comment: 'Language for the agent (e.g., Hindi, English)'
      },
      welcomeMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Welcome message that customer will hear when call starts'
      },
      agentFlow: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Description of agent flow and conversation sequence'
      },
      customerDetails: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Details/information needed from customers'
      },
      transferCall: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'When and how calls should be transferred to human agent'
      },
      endingMessage: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Message that customer will hear when call ends'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add index on auth_user_id
    await queryInterface.addIndex('agent_setups', ['auth_user_id'], {
      name: 'agent_setups_auth_user_id_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('agent_setups');
  }
};

