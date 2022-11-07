const { STRING, BOOLEAN } = require('sequelize')
const db = require('../config/db')

const Category = db.define('Category', {

    name: {
        allowNull: false,
        type: STRING,
    },
    uId: {
        allowNull: false,
        unique: true,
        type: STRING
    },
    image: {
        allowNull: false,
        type: STRING,
    },
    enabled: {
        allowNull: false,
        defaultValue: true,
        type: BOOLEAN
    },
    region: {
        allowNull: true,
        type: STRING
    }

}, { tableName: 'categories' })

Category.sync({ alter: false })

module.exports = Category