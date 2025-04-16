const sequelize = require('../db')
const { Model, DataTypes } = require('sequelize')
const User = require('./User')

class Shelter extends Model{}

Shelter.init({
    address: {
        type: DataTypes.STRING,
        allowNull: false
    },
    animals: {
        type: DataTypes.STRING,
        allowNull: false
    },
    about: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    website: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
  sequelize,
  modelName: 'Shelter'
})

Shelter.belongsTo(User);
User.hasOne(Shelter);

module.exports = Shelter