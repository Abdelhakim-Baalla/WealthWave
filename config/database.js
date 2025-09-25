const { Sequelize } = require("sequelize");

// console.log(Sequelize);

const sequelize = new Sequelize("wealthwave", "root", "123456", {
  host: "localhost",
  dialect: "mysql",
});

// console.log(sequelize);

sequelize
  .authenticate()
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.error("Not connected", err);
  });

module.exports = sequelize;
