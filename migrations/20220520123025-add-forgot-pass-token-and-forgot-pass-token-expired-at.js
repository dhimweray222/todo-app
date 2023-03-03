'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'forgot_pass_token', { type: Sequelize.STRING });
    await queryInterface.addColumn('Users', 'forgot_pass_token_expired_at', { type: Sequelize.DATE });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'forgot_pass_token', { /* query options */ });
    await queryInterface.removeColumn('Users', 'forgot_pass_token_expired_at', { /* query options */ });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
