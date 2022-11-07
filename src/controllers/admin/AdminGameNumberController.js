const Game = require("../../models/Game")
const UserGame = require("../../models/UserGame")
const responses = require('../../utils/responses')
const { Op } = require("sequelize")

exports.index = async (req, res) => {
    try {
        let gameId = req.params.id
        const game = await Game.findOne({ where: { id: gameId } })
        if (game) {
            const numbers = await UserGame.findAll({ where: { game_id: gameId, createdAt: { [Op.gt]: game.updatedAt } } })
            if (numbers) responses.dataSuccess(res, numbers)
            else responses.notFoundError(res, 'No Numbers Has Been Chosen For The Recent Game.')
        }
        else responses.notFoundError(res, 'The Game With This Identification Cannot Be Found')
    }
    catch (err) {
        responses.serverError(res, err)
    }
}

exports.show = async (req, res) => {
    try {
        let gameId = req.params.id
        const game = await Game.findOne({ where: { id: gameId } })
        if (game) {
            const numbers = await UserGame.findAll({
                where: {
                    game_id: gameId,
                    createdAt: { [Op.gt]: game.updatedAt },
                    chosen_number: { [Op.like]: `%${req.body.number}` }
                }
            })
            if (numbers) responses.dataSuccess(res, numbers)
            else responses.notFoundError(res, 'The Numbers Entered Is Not Choosen Yet.')
        }
        else responses.notFoundError(res, 'The Game With This Identification Cannot Be Found')
    }
    catch (err) {
        responses.serverError(res, err)
    }
}
