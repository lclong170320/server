'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      category.hasMany(models.product, { foreignKey: "category_id"})
    }
  }
  category.init({
    category_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    category_name: DataTypes.STRING,
    category_img: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'category',
    paranoid: true,
    deletedAt: 'deletedAt'
  });
  return category;
};
