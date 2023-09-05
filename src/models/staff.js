"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class staff extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      staff.hasMany(models.order, { foreignKey: "order_id" });

      staff.belongsTo(models.account, { foreignKey: "account_id" });
    }
  }
  staff.init(
    {
      staff_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      account_id: DataTypes.INTEGER,
      staff_name: DataTypes.STRING,
      staff_dob: DataTypes.DATE,
      staff_address: DataTypes.TEXT,
      staff_avatar: DataTypes.TEXT,
      staff_type: DataTypes.BOOLEAN,
      staff_gmail: DataTypes.TEXT,
      staff_phone: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: "staff",
      paranoid: true,
    }
  );
  return staff;
};
