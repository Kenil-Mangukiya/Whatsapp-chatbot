/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Add role column with ENUM type
    await queryInterface.addColumn('auth_users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
      comment: 'User role: user (regular) or admin'
    });

    // Add index for faster lookups
    await queryInterface.addIndex('auth_users', ['role'], {
      name: 'auth_users_role_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('auth_users', 'auth_users_role_idx');
    await queryInterface.removeColumn('auth_users', 'role');
  }
};



export default {
  async up(queryInterface, Sequelize) {
    // Add role column with ENUM type
    await queryInterface.addColumn('auth_users', 'role', {
      type: Sequelize.ENUM('user', 'admin'),
      allowNull: false,
      defaultValue: 'user',
      comment: 'User role: user (regular) or admin'
    });

    // Add index for faster lookups
    await queryInterface.addIndex('auth_users', ['role'], {
      name: 'auth_users_role_idx'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('auth_users', 'auth_users_role_idx');
    await queryInterface.removeColumn('auth_users', 'role');
  }
};










