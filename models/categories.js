const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Utilisateur = require("./utilisateurs");

const Categorie = sequelize.define("Categorie", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  utilisateur: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: "id",
    },
  },
});

module.exports = Categorie;
