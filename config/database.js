const { Sequelize } = require('sequelize');

// console.log(Sequelize);

const sequelize = new Sequelize('wealthwave', 'root', '123456', {
  host: 'localhost',
  dialect: 'mysql',
});

// console.log(sequelize);

module.exports = sequelize;