const { STRING, INTEGER, TEXT } = require('sequelize')
const db = require('../config/db')
const Game = require('./Game')
const GameIteration = require('./GameIteration')

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
        allowNull: true,
        defaultValue: "",
        type: TEXT
    },
    month: {
        allowNull: true,
        defaultValue: "",
        type: STRING
    },
    day: {
        allowNull: true,
        defaultValue: "",
        type: STRING
    },
    other: {
        allowNull: true,
        type: STRING
    },
    index: {
        allowNull: true,
        defaultValue: 0,
        type: INTEGER
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

Winner.sync({ alter: true })

Game.hasMany(Winner, { foreignKey: 'game_id' })
Winner.belongsTo(Game, { foreignKey: 'game_id' })

GameIteration.hasOne(Winner, { foreignKey: 'iteration_id' })

module.exports = Winner