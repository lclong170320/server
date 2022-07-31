'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('customers', {
      customer_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      customer_dob: {
        allowNull: false,
        type: Sequelize.DATE
      },
      customer_address: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      address_avatar: {
        type: Sequelize.TEXT
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('customers');
  }
};
