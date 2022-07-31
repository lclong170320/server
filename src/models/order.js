'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  order.init({
    order_id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    customer_id: DataTypes.INTEGER,
    staff_id: DataTypes.INTEGER,
    status_id: DataTypes.INTEGER,
    order_total: DataTypes.FLOAT,
    order_payment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};
