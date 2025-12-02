/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('auth_users', 'assignedPhoneNumber', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Assigned phone number for business operations'
    });

    // Add index for faster lookups
    await queryInterface.addIndex('auth_users', ['assignedPhoneNumber'], {
      name: 'auth_users_assignedPhoneNumber_idx',
      unique: true,
      where: {
        assignedPhoneNumber: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('auth_users', 'auth_users_assignedPhoneNumber_idx');
    await queryInterface.removeColumn('auth_users', 'assignedPhoneNumber');
  }
};



export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('auth_users', 'assignedPhoneNumber', {
      type: Sequelize.STRING(20),
      allowNull: true,
      unique: true,
      comment: 'Assigned phone number for business operations'
    });

    // Add index for faster lookups
    await queryInterface.addIndex('auth_users', ['assignedPhoneNumber'], {
      name: 'auth_users_assignedPhoneNumber_idx',
      unique: true,
      where: {
        assignedPhoneNumber: {
          [Sequelize.Op.ne]: null
        }
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('auth_users', 'auth_users_assignedPhoneNumber_idx');
    await queryInterface.removeColumn('auth_users', 'assignedPhoneNumber');
  }
};







