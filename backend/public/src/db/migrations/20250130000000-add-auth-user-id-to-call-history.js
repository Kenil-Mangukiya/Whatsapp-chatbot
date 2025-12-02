/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('call_history', 'auth_user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Reference to auth_users table - user who owns this call'
    });

    // Add index for faster lookups
    await queryInterface.addIndex('call_history', ['auth_user_id'], {
      name: 'call_history_auth_user_id_idx'
    });

    // Add foreign key constraint (optional, but recommended)
    await queryInterface.addConstraint('call_history', {
      fields: ['auth_user_id'],
      type: 'foreign key',
      name: 'call_history_auth_user_id_fk',
      references: {
        table: 'auth_users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('call_history', 'call_history_auth_user_id_fk');
    await queryInterface.removeIndex('call_history', 'call_history_auth_user_id_idx');
    await queryInterface.removeColumn('call_history', 'auth_user_id');
  }
};



export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('call_history', 'auth_user_id', {
      type: Sequelize.INTEGER,
      allowNull: true,
      comment: 'Reference to auth_users table - user who owns this call'
    });

    // Add index for faster lookups
    await queryInterface.addIndex('call_history', ['auth_user_id'], {
      name: 'call_history_auth_user_id_idx'
    });

    // Add foreign key constraint (optional, but recommended)
    await queryInterface.addConstraint('call_history', {
      fields: ['auth_user_id'],
      type: 'foreign key',
      name: 'call_history_auth_user_id_fk',
      references: {
        table: 'auth_users',
        field: 'id'
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('call_history', 'call_history_auth_user_id_fk');
    await queryInterface.removeIndex('call_history', 'call_history_auth_user_id_idx');
    await queryInterface.removeColumn('call_history', 'auth_user_id');
  }
};







