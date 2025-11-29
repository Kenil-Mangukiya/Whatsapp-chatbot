/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Add phoneNumber column to auth_users table
    await queryInterface.addColumn('auth_users', 'phoneNumber', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Phone number for OTP authentication',
      after: 'avatar' // Add column after avatar column
    });

    // Add unique index on phoneNumber
    await queryInterface.addIndex('auth_users', ['phoneNumber'], {
      name: 'idx_auth_users_phoneNumber',
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the unique index first
    try {
      await queryInterface.removeIndex('auth_users', 'idx_auth_users_phoneNumber');
    } catch (error) {
      // Index might not exist
      console.log('Index removal error (can be ignored):', error.message);
    }

    // Remove the phoneNumber column
    await queryInterface.removeColumn('auth_users', 'phoneNumber');
  }
};




export default {
  async up(queryInterface, Sequelize) {
    // Add phoneNumber column to auth_users table
    await queryInterface.addColumn('auth_users', 'phoneNumber', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Phone number for OTP authentication',
      after: 'avatar' // Add column after avatar column
    });

    // Add unique index on phoneNumber
    await queryInterface.addIndex('auth_users', ['phoneNumber'], {
      name: 'idx_auth_users_phoneNumber',
      unique: true
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the unique index first
    try {
      await queryInterface.removeIndex('auth_users', 'idx_auth_users_phoneNumber');
    } catch (error) {
      // Index might not exist
      console.log('Index removal error (can be ignored):', error.message);
    }

    // Remove the phoneNumber column
    await queryInterface.removeColumn('auth_users', 'phoneNumber');
  }
};




