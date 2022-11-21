const { STRING, BOOLEAN, INTEGER, DOUBLE, TEXT } = require('sequelize')
const db = require('../config/db')
const AlternateGame = require('./AlternateGame')

const AlternateGameImage = db.define('AlternateGameImage', {
    alternate_game_id: {
        allowNull: false,
        type: INTEGER,
        references: {
            model: AlternateGame,
            key: 'id'
        }
    },
    image: {
        allowNull: false,
        type: STRING
    }
}, { tableName: 'alternate_game_images' })

AlternateGame.hasMany(AlternateGameImage, { foreignKey: 'alternate_game_id' })
AlternateGameImage.belongsTo(AlternateGame, { foreignKey: 'alternate_game_id' })

AlternateGame.sync({ alter: true })

module.exports = AlternateGame