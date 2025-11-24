/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('auth_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Username for authentication'
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
        comment: 'Email address'
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: true,
        comment: 'Hashed password (null for OAuth users)'
      },
      avatar: {
        type: Sequelize.STRING(500),
        allowNull: true,
        comment: 'Avatar URL from Cloudinary'
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Add indexes
    await queryInterface.addIndex('auth_users', ['email'], {
      name: 'idx_auth_users_email'
    });
    await queryInterface.addIndex('auth_users', ['username'], {
      name: 'idx_auth_users_username'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('auth_users');
  }
};

