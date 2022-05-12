'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // add a new user table: user with columns: id, username, password, access_info, created_at, updated_at
    await queryInterface.createTable('users', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      username: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      access_info: { 
        type: Sequelize.TEXT, // access_info is a json string
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },

  async down (queryInterface, Sequelize) {
    // remove the user table
    await queryInterface.dropTable('users');
  }
};
