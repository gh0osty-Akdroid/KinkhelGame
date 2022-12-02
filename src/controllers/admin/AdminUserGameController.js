const responses = require('../../utils/responses')
const Category = require("../../models/Category")
const Game = require("../../models/Game")
const UserGame = require("../../models/UserGame")
const GameIteration = require('../../models/GameIteration')
const AlternateGame = require('../../models/AlternateGame')

exports.show = (req, res) => {
    findUserGames({ user_id: req.params.user, game_id: req.params.game, iteration_id: req.query.iteration }, res, req)
}

exports.game = (req, res) => {
    findUserGames({ game_id: req.params.id, iteration_id: req.query.iteration }, res, req)
}

exports.user = (req, res) => {
    findUserGames({ user_id: req.params.id }, res, req)
}

exports.merchant = (req, res) => {
    findUserGames({ merchant_id: req.params.id }, res, req)
}

const findUserGames = async (where, res, req) => {
    const { limit, offset } = await this.getPagination(req.query.page, 25)
    await UserGame.findAndCountAll({
        limit: limit,
        offset: offset,
        where: where,
        attributes: ['merchant_id', 'chosen_number', 'user_id', 'game_id'],
        order: [['createdAt', 'DESC']],
        include: [{
            model: Game,
            attributes: ['name', 'id', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'description', 'notes', 'winning_image'],
            include: [
                { model: Category, attributes: ['uId', 'name'] },
                { model: AlternateGame, attributes: ['required_participants'] }
            ]
        }, {
            model: GameIteration
        }]
    }).then(async v => {
        let data = await this.getPagingData(v, req.query.page, limit)
        responses.dataSuccess(res, data)
    }).catch(err => {
        console.log(err);
        responses.serverError(res, err)
    })
}

exports.getPagingData = async (items, page, limit) => {
    const { count: totalItems, rows: product } = items;
    const data = items.rows
    const currentPage = page ? +page : 0;
    const totalPages = Math.ceil(totalItems / limit);
    return { data, totalPages, currentPage };
}

exports.getPagination = async (page, size) => {
    const limit = size ? +size : 25;
    var offset;
    if (!page || page <= 1) {
        offset = 0;
    }
    else {
        offset = (page - 1) * limit
    }
    return { limit, offset };
}
// TODO:: GAME ITERATION IN FIND USER GAMES