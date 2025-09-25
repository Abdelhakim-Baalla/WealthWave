const database = require("../config/database.js");
const utilisateurs = require("./utilisateurs");
const transactions = require("./transactions");
const objectifs = require("./objectifs");
const notifications = require("./notifications");
const categories = require("./categories");
const budgets = require("./budgets");

utilisateurs.hasMany(transactions, {
  foreignKey: "utilisateur",
});

utilisateurs.hasMany(objectifs, {
  foreignKey: "utilisateur",
});

utilisateurs.hasMany(budgets, {
  foreignKey: "utilisateur",
});

utilisateurs.hasMany(notifications, {
  foreignKey: "utilisateur",
});

transactions.belongsTo(utilisateurs, {
  foreignKey: "utilisateur",
});

transactions.belongsTo(categories, {
  foreignKey: "categorie",
});

objectifs.belongsTo(categories, {
  foreignKey: "categorie",
});

objectifs.belongsTo(utilisateurs, {
  foreignKey: "utilisateur",
});

notifications.belongsTo(utilisateurs, {
  foreignKey: "utilisateur",
});

categories.hasMany(transactions, {
  foreignKey: "categorie",
});

categories.hasMany(objectifs, {
  foreignKey: "categorie",
});

categories.hasMany(budgets, {
  foreignKey: "categorie",
});

budgets.belongsTo(categories, {
  foreignKey: "categorie",
});

module.exports = {
    database,
    utilisateurs,
    transactions,
    objectifs,
    notifications,
    categories,
    budgets,
}
