'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('order_details', {
      // detail_id: DataTypes.INTEGER,
      // order_id: DataTypes.INTEGER,
      // product_id: DataTypes.INTEGER,
      // detail_quantity: DataTypes.INTEGER,
      // detail_price: DataTypes.FLOAT
      detail_id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      order_id: {
        type: Sequelize.INTEGER
      },
      product_id: {
        type: Sequelize.INTEGER
      },
      detail_quantity: {
        type: Sequelize.INTEGER
      },
      detail_price: {
        type: Sequelize.FLOAT
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('order_details');
  }
};