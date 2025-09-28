const { Sequelize } = require("sequelize");

// console.log(Sequelize);

const sequelize = new Sequelize("wealthwave", "root", "123456", {
  host: "localhost",
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
