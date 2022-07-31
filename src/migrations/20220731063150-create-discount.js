'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('discounts', {
      discount_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      discount_name: {
        type: Sequelize.STRING
      },
      discount_code: {
        allowNull: false,
        type: Sequelize.STRING
      },
      discount_percent: {
        allowNull: false,
        type: Sequelize.FLOAT
      },
      discount_start: {
        allowNull: false,
        type: Sequelize.DATE
      },
      discount_end: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('discounts');
  }
};
