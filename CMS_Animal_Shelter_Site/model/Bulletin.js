const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')

class Bulletin extends Model {}

Message.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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