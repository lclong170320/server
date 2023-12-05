const { Sequelize } = require("sequelize");
const mysql2 = require("mysql2");
// Option 3: Passing parameters separately (other dialects)
const sequelize = new Sequelize("sieuthimini", "root", null, {
  host: "localhost",
  dialect: "mysql",
  dialectModule: mysql2,
  logging: false,
});

let conNectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

module.exports = conNectDB;
