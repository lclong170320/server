"use strict";
const { INTEGER } = require("sequelize");
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
      customer.hasMany(models.comment, { foreignKey: "customer_id" });

      customer.hasMany(models.order, { foreignKey: "order_id" });

      customer.belongsTo(models.account, { foreignKey: "account_id" });

      customer.hasMany(models.favorite, { foreignKey: "customer_id" });

      customer.hasMany(models.address, { foreignKey: "customer_id" });
    }
  }
  customer.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      account_id: DataTypes.INTEGER,
      customer_name: DataTypes.STRING,
      customer_dob: DataTypes.DATE,
      customer_phone:  DataTypes.INTEGER,
      customer_avatar: DataTypes.TEXT,
      customer_gmail:  DataTypes.TEXT,
      type:  DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "customer",
    }
  );
  return customer;
};
