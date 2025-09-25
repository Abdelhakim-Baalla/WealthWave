const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Utilisateur = require("./utilisateurs");
const Categorie = require("./categories");

const Transaction = sequelize.define("Transaction", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  type: {
    type: DataTypes.ENUM,
    values: ["Revenu", "Frais", "Transfert"],
  },

  prix: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },

  date: {
    type: DataTypes.DATE,
    allowNull: false,
  },

  utilisateur: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: "id",
    },
  },

  categorie: {
    type: DataTypes.INTEGER,
    references: {
      model: Categorie,
      key: "id",
    },
  },

  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  }
});

module.exports = Transaction;
