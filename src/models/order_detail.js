"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order_detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order_detail.belongsTo(models.product, { foreignKey: "product_id" });
      order_detail.belongsTo(models.order, { foreignKey: "order_id" });
    }
  }
  order_detail.init(
    {
      detail_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      detail_quantity: DataTypes.INTEGER,
      detail_price: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "order_detail",
    }
  );
  return order_detail;
};
