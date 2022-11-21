const responses = require('../../utils/responses')
const Category = require("../../models/Category")
const Game = require("../../models/Game")
const UserGame = require("../../models/UserGame")

exports.game = (req, res) => {
    findUserGames({ game_id: req.params.id }, res)
}

exports.user = (req, res) => {
    findUserGames({ user_id: req.params.id }, res)
}

exports.show = (req, res) => {
    findUserGames({ user_id: req.params.user, game_id: req.params.game }, res)
}

exports.merchant = (req, res) => {
    findUserGames({ merchant_id: req.params.id }, res)
}

const findUserGames = async (where, res) => {
    await UserGame.findAndCountAll({
        limit: 20,
        offset: 20 * req.query.page,
        where: where,
        attributes: ['merchant_id', 'chosen_number', 'user_id', 'game_id'],
        order: [['createdAt', 'DESC']],
        include: {
            model: Game,
            attributes: ['name', 'id', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'description', 'notes', 'winning_image'],
            include: { model: Category, attributes: ['uId', 'name'] }
        }
    }).then(v => responses.dataSuccess(res, v)).catch(err => responses.serverError(res, err))
}

// TODO:: GAME ITERATION IN FIND USER GAMES