/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Add from_number column
    await queryInterface.addColumn('call_history', 'from_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Phone number that initiated the call'
    });

    // Add to_number column
    await queryInterface.addColumn('call_history', 'to_number', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Phone number that received the call'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns in reverse order
    await queryInterface.removeColumn('call_history', 'to_number');
    await queryInterface.removeColumn('call_history', 'from_number');
  }
};

