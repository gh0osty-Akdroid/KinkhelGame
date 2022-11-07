const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const db = require('../config/db')
const Game = require('./Game')

const GameIteration = db.define('GameIteration',{
    game_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'games',
            key: 'id'
        }
    }
}, {
    tableName: 'game_iterations'
})

GameIteration.sync({ alter: false })

Game.hasMany(GameIteration, { foreignKey: 'game_id' })

GameIteration.belongsTo(Game, { foreignKey: 'game_id' })

module.exports = GameIteration