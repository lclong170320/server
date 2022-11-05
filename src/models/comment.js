"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      comment.belongsTo(models.product, { foreignKey: "product_id" });
      comment.belongsTo(models.customer, { foreignKey: "customer_id" });
    }
  }
  comment.init(
    {
      comment_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      customer_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      comment_content: DataTypes.STRING,
      comment_star:DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "comment",
    }
  );
  return comment;
};
