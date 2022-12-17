const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const db = require('../config/db')
const Game = require('./Game')
const GameIteration = require('./GameIteration')

const UserGame = db.define('UserGame', {

    game_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'games',
            key: 'id'
        }
    },
    user_id: {
        allowNull: true,
        type: STRING
    },
    merchant_id: {
        allowNull: true,
        type: STRING
    },
    chosen_number: {
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

}, { tableName: 'user_game' })

UserGame.sync({ alter: false })

Game.hasMany(UserGame, { foreignKey: 'game_id' })

UserGame.belongsTo(Game, { foreignKey: 'game_id' })

UserGame.hasOne(GameIteration, { foreignKey: 'id', sourceKey: 'iteration_id' })

module.exports = UserGame