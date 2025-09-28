const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Utilisateur = require("./utilisateurs");
const Categorie = require("./categories");

const Budget = sequelize.define("Budget", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  nom: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  categorie: {
    type: DataTypes.INTEGER,
    references: {
      model: Categorie,
      key: "id",
    },
  },

  utilisateur: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: "id",
    },
  },

  montant: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Budget;
