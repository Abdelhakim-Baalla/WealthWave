const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Utilisateur = require("./utilisateurs");

const motDePasseRestorationToken = sequelize.define(
  "motDePasseRestorationToken",
  {
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
      onDelete: "CASCADE",
    },

    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date_expiration: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
    date_creation: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.NOW,
    },
  }
);

module.exports = motDePasseRestorationToken;
