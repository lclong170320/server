"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable(
      "customers",
      {
        customer_id: {
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
        customer_name: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        customer_gmail: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        type: {
          allowNull: true,
          type: Sequelize.STRING,
        },
        customer_dob: {
          allowNull: true,
          type: Sequelize.DATE,
        },
        customer_phone: {
          allowNull: true,
          type: Sequelize.INTEGER,
        },
        customer_avatar: {
          allowNull: true,
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
      },
      {
        timestamps: "false",
      }
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("customers");
  },
};
