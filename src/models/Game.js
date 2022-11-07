const { TIME } = require('sequelize')
const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const db = require('../config/db')
const Category = require('./Category')

const Game = db.define('Game', {

    name: {
        allowNull: false,
        type: STRING
    },
    prize: {
        allowNull: false,
        type: STRING
    },
    category_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'categories',
            key: 'id'
        }
    },
    charge: {
        allowNull: false,
        type: DOUBLE
    },
    winning_numbers: {
        allowNull: false,
        defaultValue: '3',
        type: STRING
    },
    total_numbers: {
        allowNull: false,
        defaultValue: 3,
        type: STRING
    },
    allowed_numbers: {
        allowNull: false,
        defaultValue: 3,
        type: INTEGER
    },
    opening_time: {
        allowNull: false,
        type: STRING
    },
    closing_time: {
        allowNull: false,
        type: STRING
    },
    description: {
        allowNull: true,
        type: TEXT
    },
    notes: {
        allowNull: true,
        type: TEXT
    },
    winning_image: {
        allowNull: true,
        type: STRING
    },
    extra: {
        type: BOOLEAN,
        defaultValue: false
    },
    extra_total_numbers: {
        allowNull: true,
        defaultValue: 3,
        type: STRING
    },
    same_time: {
        type: BOOLEAN,
        defaultValue: false
    },
    active: {
        type: BOOLEAN,
        defaultValue: false
    },
    region: {
        allowNull: true,
        type: STRING
    },
    enable_time: {
        allowNull: true,
        type: TIME
    },
    winner_announcement: {
        allowNull: true,
        type: STRING
    }
}, { tableName: 'games' })

Game.sync({ alter: false })

Category.hasMany(Game, { foreignKey: 'category_id' })
Game.belongsTo(Category, { foreignKey: 'category_id' })

module.exports = Game