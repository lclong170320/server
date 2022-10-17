"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
   `  * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.`
     */
    static associate(models) {
      // define association here
      address.belongsTo(models.customer, { foreignKey: "customer_id" });
    }
  }
  address.init(
    {
      address_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_id: {
        type: DataTypes.INTEGER,
      },
      address: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "address",
    }
  );
  return address;
};
