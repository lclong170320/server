"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("orders", {
      order_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "customers",
          key: "customer_id",
        },
      },
      staff_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: "staffs",
          key: "staff_id",
        },
      },
      order_total: {
        allowNull: false,
        type: Sequelize.FLOAT,
      },
      order_payment: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      address: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      soft_Delete: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: 0,
      },
      order_note: {
        allowNull: false,
        type: Sequelize.STRING,
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
    await queryInterface.dropTable("orders");
  },
};
