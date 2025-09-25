const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Categorie = sequelize.define('Categorie', {
    id: {
       type: DataTypes.INTEGER,
       autoIncrement: true,
       primaryKey: true,
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    }
});

module.exports = Categorie;