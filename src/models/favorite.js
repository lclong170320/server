"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class favorite extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      favorite.belongsTo(models.product, { foreignKey: "product_id" });
      favorite.belongsTo(models.customer, { foreignKey: "customer_id" });
    }
  }
  favorite.init(
    {
      favorite_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      product_id: DataTypes.INTEGER,
      customer_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "favorite",
      paranoid: true,
    }
  );
  return favorite;
};
