"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class discount extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      discount.belongsTo(models.product, { foreignKey: "product_id" });
    }
  }
  discount.init(
    {
      discount_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      discount_name: DataTypes.STRING,
      discount_code: DataTypes.STRING,
      discount_percent: DataTypes.FLOAT,
      discount_start: DataTypes.DATE,
      discount_end: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "discount",
    }
  );
  return discount;
};
