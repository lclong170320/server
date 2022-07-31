'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  account.init({
    username: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    password: DataTypes.STRING,
    staff_id: DataTypes.INTEGER,
    customer_id: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'account',
  });
  return account;
};
