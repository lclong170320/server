"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class storage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      storage.belongsTo(models.product, { foreignKey: "product_id" });
    }
  }
  storage.init(
    {
      storage_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: DataTypes.INTEGER,
      product_quantity: DataTypes.INTEGER,
      product_sold: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "storage",
      paranoid: true,
    }
  );
  return storage;
};
