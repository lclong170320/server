"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      product.belongsTo(models.category, { foreignKey: "category_id" });
      product.hasMany(models.comment, { foreignKey: "product_id" });
      product.hasMany(models.favorite, { foreignKey: "product_id" });
      product.hasMany(models.image, { foreignKey: "product_id" });
      product.hasOne(models.discount, { foreignKey: "product_id" });
      product.hasOne(models.storage, { foreignKey: "product_id" });

      product.hasMany(models.order_detail, { foreignKey: "product_id" });


    }
  }

  product.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      category_id: DataTypes.INTEGER,
      product_name: DataTypes.STRING,
      product_describe: DataTypes.TEXT,
      product_price: DataTypes.FLOAT,
      provider: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "product",
      paranoid: true,
      deletedAt: 'deletedAt'
    }
  );
  return product;
};
