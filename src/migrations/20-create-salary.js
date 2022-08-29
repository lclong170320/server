"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("salaries", {
      salary_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      staff_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "staffs",
          key: "staff_id",
        },
      },
      salary: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      coefficient: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      start_day: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      end_day: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("salaries");
  },
};
