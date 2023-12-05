"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("staffs", {
      staff_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
        type: Sequelize.STRING,
      },
      staff_dob: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      staff_address: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      staff_avatar: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      staff_type: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
      },
      staff_gmail: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      staff_phone: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("staffs");
  },
};
