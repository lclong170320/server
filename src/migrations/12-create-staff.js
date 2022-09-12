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
      account_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: {
          model: "accounts",
          key: "account_id",
        },
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
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('staffs');
  }
};
