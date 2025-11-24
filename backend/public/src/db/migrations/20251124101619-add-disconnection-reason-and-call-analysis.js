/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    // Add disconnection_reason column
    await queryInterface.addColumn('call_history', 'disconnection_reason', {
      type: Sequelize.STRING(50),
      allowNull: true,
      comment: 'Reason for call disconnection (user_hangup, agent_hangup, etc.)'
    });

    // Add call_analysis column
    await queryInterface.addColumn('call_history', 'call_analysis', {
      type: Sequelize.JSON,
      allowNull: true,
      comment: 'Call analysis data including summary, sentiment, and success status'
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove columns in reverse order
    await queryInterface.removeColumn('call_history', 'call_analysis');
    await queryInterface.removeColumn('call_history', 'disconnection_reason');
  }
};

