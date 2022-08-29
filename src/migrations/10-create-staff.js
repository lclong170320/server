'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('staffs', {
      staff_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      staff_name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      staff_dob: {
        allowNull: false,
        type: Sequelize.DATE
      },
      staff_address: {
        type: Sequelize.TEXT
      },
      staff_avatar: {
        type: Sequelize.TEXT
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staffs');
  }
};
