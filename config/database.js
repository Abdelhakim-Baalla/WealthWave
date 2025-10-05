const { Sequelize } = require("sequelize");
require("dotenv").config();
// console.log(Sequelize);

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false,
});

// console.log(sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.error("Database Not connected", err);
  });

module.exports = sequelize;
