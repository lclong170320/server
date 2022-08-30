"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class customer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      customer.hasMany(models.comment, { foreignKey: "category_id" });

      customer.hasMany(models.order, { foreignKey: "order_id" });

      customer.belongsTo(models.account, { foreignKey: "username" });
    }
  }
  customer.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_name: DataTypes.STRING,
      customer_dob: DataTypes.DATE,
      customer_address: DataTypes.TEXT,
      address_avatar: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "customer",
    }
  );
  return customer;
};
