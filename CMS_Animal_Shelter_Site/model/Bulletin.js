const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Bulletin extends Model {}

Bulletin.init({
    date: {
        type: DataTypes.NUMBER,
        defaultValue: Date.now,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contents: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'Bulletin'
});

module.exports = Bulletin