const { STRING, INTEGER, TEXT } = require('sequelize')
const db = require('../config/db')
const Game = require('./Game')

const Winner = db.define('Winner', {
    image: {
        allowNull: false,
        type: STRING
    },
    game_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'games',
            key: 'id'
        }
    },
    name: {
        allowNull: false,
        type: STRING({ length: 100 })
    },
    info: {
        allowNull: false,
        type: TEXT
    },
    month: {
        allowNull: true,
        type: STRING
    },
    day: {
        allowNull: true,
        type: STRING
    },
    other: {
        allowNull: true,
        type: STRING
    },
    index: {
        allowNull: false,
        type: INTEGER
    },
    region: {
        allowNull: false,
        type: STRING
    },
    iteration_id: {
        allowNull: true,
        type: INTEGER,
        references: {
            model: 'game_iterations',
            key: 'id'
        }
    }
}, { tableName: 'winners' })

Winner.sync({ alter: false })

Game.hasMany(Winner, { foreignKey: 'game_id' })
Winner.belongsTo(Game, { foreignKey: 'game_id' })

module.exports = Winner