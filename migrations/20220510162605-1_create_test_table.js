'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // Create table test in database collect
    return await queryInterface.createTable('test', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING
      }
    });

  },

  async down (queryInterface, Sequelize) {
    // Drop table test in database collect
    return await queryInterface.dropTable('test');
  }
};
