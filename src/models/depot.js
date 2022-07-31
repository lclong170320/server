'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class depot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  depot.init({
    depot_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    product_id: DataTypes.INTEGER,
    quantity: DataTypes.INTEGER,
    sold: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'depot',
  });
  return depot;
};