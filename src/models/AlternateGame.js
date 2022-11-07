const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const db = require('../config/db')
const Game = require('./Game')

const AlternateGame = db.define('AlternateGame', {
    game_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: 'games',
            key: 'id'
        }
    },
    current_participants:{
        allowNull:false,
        type: INTEGER,
        defaultValue: 0
    },
    required_participants: {
        allowNull: false,
        type: INTEGER,
    },
    active_participants: {
        allowNull: false,
        defaultValue: 0,
        type: INTEGER
    },
    image: {
        allowNull: true,
        type: STRING
    }
}, {
    tableName: 'alternate_games'
})

Game.hasOne(AlternateGame, { foreignKey: 'game_id' })
AlternateGame.belongsTo(Game, { foreignKey: 'game_id' })

AlternateGame.sync({ alter: false })

module.exports = AlternateGame