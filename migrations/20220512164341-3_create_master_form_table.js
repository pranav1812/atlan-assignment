'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    // create table: master_form_table
    return await queryInterface.createTable('master_form_table', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      owner: {
        type: Sequelize.UUID,
        allowNull: false
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: "Untitled Form"
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        defaultValue: ""
      },
      response_link: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      table: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      table_schema: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      columns: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      meta_data: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      spread_sheet_link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      validation_script: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      extras: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    // drop table: master_form_table
    return await queryInterface.dropTable('master_form_table');
  }
};
