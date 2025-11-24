/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // First, find and drop all unique indexes/constraints on username
    const [indexes] = await queryInterface.sequelize.query(
      `SHOW INDEX FROM auth_users WHERE Column_name = 'username' AND Non_unique = 0`
    );
    
    for (const index of indexes) {
      await queryInterface.sequelize.query(
        `ALTER TABLE auth_users DROP INDEX \`${index.Key_name}\``
      );
    }

    // Remove unique constraint from username column using raw SQL
    await queryInterface.sequelize.query(
      `ALTER TABLE auth_users MODIFY COLUMN username VARCHAR(255) NOT NULL COMMENT 'Username for authentication'`
    );

    // Add non-unique index on username for performance
    await queryInterface.addIndex('auth_users', ['username'], {
      name: 'idx_auth_users_username',
      unique: false
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the non-unique index
    try {
      await queryInterface.removeIndex('auth_users', 'idx_auth_users_username');
    } catch (error) {
      // Index might not exist
    }

    // Restore unique constraint on username column
    await queryInterface.changeColumn('auth_users', 'username', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
      comment: 'Username for authentication'
    });

    // Add unique index back
    await queryInterface.addIndex('auth_users', ['username'], {
      name: 'idx_auth_users_username',
      unique: true
    });
  }
};
