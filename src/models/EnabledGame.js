const { STRING, BOOLEAN, INTEGER } = require('sequelize')
const db = require('../config/db')
const Game = require('./Game')

const EnabledGame = db.define('EnabledGame', {
    game_id: {
        allowNull: false,
        unique: true,
        type: INTEGER,
        references: {
            model: 'games',
            key: 'id'
        }
    }
}, { tableName: 'enabled_games' })

EnabledGame.sync({ alter: false })

EnabledGame.belongsTo(Game, { foreignKey: 'game_id' })

Game.hasOne(EnabledGame, { foreignKey: 'game_id' })

module.exports = EnabledGame