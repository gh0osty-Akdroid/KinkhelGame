const AlternateGame = require('../models/AlternateGame')
const AlternateGameImage = require('../models/AlternateGameImage')
const Category = require('../models/Category')
const EnabledGame = require('../models/EnabledGame')
const Game = require('../models/Game')
const GameIteration = require('../models/GameIteration')
const responses = require('../utils/responses')

exports.categories = async (req, res) => {
    let site = req.query.site
    let where = {}
    if (site) {
        where.region = site
    }
    await Category.findAll({ attributes: ['uId', 'name', 'image', 'enabled', 'id'], order: [['createdAt', 'DESC']], where: where })
        .then(v => responses.dataSuccess(res, v)).catch(err => responses.serverError(res, err))
}

exports.showCategory = async (req, res) => {
    let site = req.query.site
    let where = {
        id: req.params.id
    }
    if (site) {
        where.region = site
    }
    await Category.findOne({ where: where, include: { model: Game, where: { active: true } } }).then(v => responses.dataSuccess(res, v))
        .catch(err => responses.serverError(res, err))
}

exports.index = async (req, res) => {
    let site = req.query.site
    let where = {}
    if (site) {
        where.region = site
    }
    await EnabledGame.findAll({
        attributes: ['*'],
        include: {
            model: Game,
            where: where,
            attributes: ['name', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'id', 'extra', 'active', 'same_time', 'winner_announcement'],
            include: [
                { model: Category, attributes: ['uId', 'name', 'image'], order: [['createdAt', 'DESC']] },
                { model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'] }
            ]
        }
    }).then(v => {
        const games = []
        v.forEach(item => {
            if (!item.Game.AlternateGame) {
                games.push(item.Game)
            }
        })
        responses.dataSuccess(res, games)
    }).catch(err => responses.serverError(res, err))
}

exports.show = async (req, res) => {
    await Game.findOne({
        where: { id: req.params.id },
        attributes: ['name', 'id', 'prize', 'active', 'winner_announcement', 'extra', 'allowed_numbers', 'charge', 'total_numbers', 'same_time', 'opening_time', 'closing_time', 'description', 'notes', 'winning_image'],
        include: [
            { model: Category, attributes: ['uId', 'name', 'image'] },
            { model: EnabledGame, attributes: ['createdAt'] },
            { model: GameIteration, attributes: ['id'], limit: 1, order: [['createdAt', 'DESC']] },
            { model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'] }
        ]
    }).then(v => v && v.EnabledGame ? responses.dataSuccess(res, v) : responses.notFoundError(res, 'The Game With This Identification Cannot Be Found.'))
        .catch(err => responses.serverError(res, err))
}

exports.alternateIndex = async (req, res) => {
    let site = req.query.site
    let where = {}
    if (site) {
        where.region = site
    }
    await EnabledGame.findAll({
        attributes: ['*'],
        include: {
            model: Game,
            where: where,
            attributes: ['name', 'prize', 'charge', 'id'],
            include: [
                { model: GameIteration, attributes: ['id'], limit: 1, order: [['createdAt', 'DESC']] },
                { model: Category, attributes: ['uId', 'name', 'image'], order: [['createdAt', 'DESC']] },
                {
                    model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'], include: {
                        model: AlternateGameImage, attributes: ['image']
                    }
                }
            ]
        }
    }).then(v => {
        const games = []
        v.forEach(item => {
            if (item.Game.AlternateGame) {
                games.push(item.Game)
            }
        })
        responses.dataSuccess(res, games)
    }).catch(err => responses.serverError(res, err))
}

exports.iteration = async (req, res) => {
    await GameIteration.findOne({ where: { game_id: req.params.id }, order: [['id', 'DESC']] }).then(v => {
        responses.dataSuccess(res, v.id)
    }).catch(err => responses.serverError(res, 'The Iteration Cannot Be Found'))
}