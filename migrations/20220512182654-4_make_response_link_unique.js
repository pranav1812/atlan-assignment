'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return await queryInterface.sequelize.query('ALTER TABLE master_form_table ADD CONSTRAINT master_form_table_response_link_unique UNIQUE (response_link)');
  },

  async down (queryInterface, Sequelize) {
    return await queryInterface.sequelize.query('ALTER TABLE "master_form_table" DROP CONSTRAINT "master_form_table_response_link_unique"');
  }
};
