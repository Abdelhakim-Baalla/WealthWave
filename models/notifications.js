const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Utilisateur = require("./utilisateurs");

const Notification = sequelize.define("Notification", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },

  utilisateur: {
    type: DataTypes.INTEGER,
    references: {
      model: Utilisateur,
      key: "id",
    },
  },

  type: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  titre: {
    type: DataTypes.STRING,
    allowNull: false,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  lu: {
    type: DataTypes.BOOLEAN,
    defaultValue: 0,
  },
});

module.exports = Notification;
