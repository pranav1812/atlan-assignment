'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // make username unique in users table
    return await queryInterface.sequelize.query(`
      ALTER TABLE users ADD CONSTRAINT users_username_key UNIQUE (username); 
    `);

  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.sequelize.query(`
      ALTER TABLE users DROP CONSTRAINT users_username_key;
    `);
  }
};
