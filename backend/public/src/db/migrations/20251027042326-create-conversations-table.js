/** @type {import('sequelize-cli').Migration} */
export default {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('conversations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      contact_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      sender_id: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      receiver_id: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      whatsapp_message_id: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      message_type: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      message_content: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      sender_type: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      receiver_type: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      status: {
        type: Sequelize.STRING(20),
        allowNull: false
      },
      thread_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      is_sent_to_contact: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_delivered_to_contact: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_read_by_contact: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      is_failed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      error_response: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      in_reply_to: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      reaction_emoji: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      user_reaction_emoji: {
        type: Sequelize.STRING(10),
        allowNull: true
      },
      contact_name: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      contact_phone: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      contact_wa_id: {
        type: Sequelize.STRING(20),
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    // Add indexes
    await queryInterface.addIndex('conversations', ['user_id']);
    await queryInterface.addIndex('conversations', ['sender_id']);
    await queryInterface.addIndex('conversations', ['thread_id']);
    await queryInterface.addIndex('conversations', ['created_at']);
    await queryInterface.addIndex('conversations', ['user_id', 'status']);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('conversations');
  }
};
