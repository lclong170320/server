'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  product.init({
    product_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category_id: DataTypes.INTEGER,
    product_name: DataTypes.STRING,
    product_img: DataTypes.TEXT,
    product_describe: DataTypes.TEXT,
    product_salePrice: DataTypes.FLOAT,
    product_price: DataTypes.FLOAT,
    provider: DataTypes.TEXT

  }, {
    sequelize,
    modelName: 'product',
  });
  return product;
};