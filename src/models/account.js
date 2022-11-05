"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class account extends Model {
    
    /**
   `  * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.`
     */
    static associate(models) {
      // define association here
      account.hasOne(models.customer, { foreignKey: "account_id" });
      account.hasOne(models.staff, { foreignKey: "account_id" });
    }
  }
  account.init(
    {
      account_id: {
        type: DataTypes.STRING,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
      },
      password: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "account",
    }
  )
  return account;
};
