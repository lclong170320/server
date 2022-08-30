"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.belongsTo(models.staff, { foreignKey: "staff_id" });
      order.belongsTo(models.comment, { foreignKey: "customer_id" });

      order.hasMany(models.order_detail, { foreignKey: "order_id" });
    }
  }
  order.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      order_total: DataTypes.FLOAT,
      order_payment: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "order",
    }
  );
  return order;
};
