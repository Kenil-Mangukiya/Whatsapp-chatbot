/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Make email and username nullable and remove unique constraint from email
    await queryInterface.changeColumn('auth_users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: false,
      comment: 'Email address (optional)'
    });

    await queryInterface.changeColumn('auth_users', 'username', {
      type: Sequelize.STRING(255),
      allowNull: true,
      unique: false,
      comment: 'Username for authentication (optional)'
    });

    // Remove password and avatar columns if they exist (they're not needed for OTP auth)
    try {
      await queryInterface.removeColumn('auth_users', 'password');
    } catch (error) {
      console.log('Password column removal error (can be ignored):', error.message);
    }

    try {
      await queryInterface.removeColumn('auth_users', 'avatar');
    } catch (error) {
      console.log('Avatar column removal error (can be ignored):', error.message);
    }

    // Add business details fields
    await queryInterface.addColumn('auth_users', 'businessName', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Business name'
    });

    await queryInterface.addColumn('auth_users', 'fullName', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Full name of the business owner'
    });

    await queryInterface.addColumn('auth_users', 'businessSize', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Business size (e.g., 1-5, 6-20, etc.)'
    });

    await queryInterface.addColumn('auth_users', 'serviceArea', {
      type: Sequelize.STRING(255),
      allowNull: true,
      comment: 'Primary service area'
    });

    // Add business hours fields
    await queryInterface.addColumn('auth_users', 'startTime', {
      type: Sequelize.TIME,
      allowNull: true,
      comment: 'Business start time'
    });

    await queryInterface.addColumn('auth_users', 'endTime', {
      type: Sequelize.TIME,
      allowNull: true,
      comment: 'Business end time'
    });

    // Add vehicleTypes JSON field
    await queryInterface.addColumn('auth_users', 'vehicleTypes', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Vehicle types with services and pricing (JSON array)'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove the new columns
    await queryInterface.removeColumn('auth_users', 'vehicleTypes');
    await queryInterface.removeColumn('auth_users', 'endTime');
    await queryInterface.removeColumn('auth_users', 'startTime');
    await queryInterface.removeColumn('auth_users', 'serviceArea');
    await queryInterface.removeColumn('auth_users', 'businessSize');
    await queryInterface.removeColumn('auth_users', 'fullName');
    await queryInterface.removeColumn('auth_users', 'businessName');

    // Restore original email and username constraints
    await queryInterface.changeColumn('auth_users', 'email', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true
    });

    await queryInterface.changeColumn('auth_users', 'username', {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: false
    });
  }
};

