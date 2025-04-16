const sequelize = require('../db');
const { Model, DataTypes } = require('sequelize');

class SiteBlogs extends Model {}

SiteBlogs.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT('long'),
        allowNull: false
    },
    featuredImage: {
        type: DataTypes.STRING
    }
}, {
    sequelize,
    modelName: 'SiteBlogs'
});

module.exports = SiteBlogs;