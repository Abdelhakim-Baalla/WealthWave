const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Utilisateur = require("./utilisateurs");
const Categorie = require("./categories");

const Objectif = sequelize.define("Objectif", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  utilisateur: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: "id",
    },
  },

  montantObjectif: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  categorie: {
    type: DataTypes.INTEGER,
    references: {
      model: Categorie,
      key: "id",
    },
  },
});

module.exports = Objectif;
