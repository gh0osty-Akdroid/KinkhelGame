const e = require("cors")
const AlternateGame = require("../../models/AlternateGame")
const Category = require("../../models/Category")
const EnabledGame = require("../../models/EnabledGame")
const AlternateGameImage = require("../../models/AlternateGameImage")
const Game = require("../../models/Game")
const responses = require('../../utils/responses')
const fileHandler = require('../../utils/fileHandler')
const helper = require('../../utils/helper')
const GameIteration = require("../../models/GameIteration")
const Winner = require("../../models/Winner")
const { where } = require("sequelize")

exports.index = async (req, res) => {
    await Game.findAndCountAll({
        attributes: ['name', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'id', 'active', 'same_time'],
        include: [
            { model: Category, attributes: ['uId', 'name', 'image'], order: [['createdAt', 'DESC']] },
            { model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'] },
            { model: EnabledGame, attributes: ['createdAt'] }
        ]
    }).then(v => responses.dataSuccess(res, v)).catch(err => responses.serverError(res, err))
}

exports.store = async (req, res) => {
    const body = req.body
    const game = Game.build(body)
    await game.save().then(async (g) => {
        if (req.body.required_participants) {
            const alternateGame = AlternateGame.build({
                game_id: g.id,
                required_participants: body.required_participants,
            })
            alternateGame.image = await fileHandler.addImage(req.body.image)
            await alternateGame.save().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
        }
        else {
            enableGame(body.startTime, body.endTime, g.id)
            return responses.blankSuccess(res)
        }
    }).catch(err => responses.serverError(res, err))
}

const enableGame = (startTime, endTime, gameId) => {
    setTimeout(async () => {
        await Game.findByPk(gameId).then(async game => {
            game.active = true
            await game.save().then(async () => {
                const iteration = new GameIteration()
                iteration.game_id = gameId
                iteration.id = helper.createId()
                await iteration.save().then(() => {
                    disableGame(startTime, endTime, gameId)
                    console.log('Game IS ACTIVE')
                }).catch(err => console.log(err))
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))

    }, startTime)
}

const disableGame = async (startTime, endTime, gameId) => {
    setTimeout(async () => {
        await Game.findByPk(gameId).then(async game => {
            game.active = false
            game.winner_announcement = null
            await game.save().then(() => {
                if (game.same_time) {
                    const oneDay = 1000 * 60 * 60 * 24
                    const newStart = startTime - endTime + oneDay
                    const newEnd = endTime + oneDay
                    enableGame(newStart, newEnd, gameId)
                    // TODO:: Possibly Wrong Logic. Change This Soon
                }
                console.log('Game NOT ACTIVE')
            }).catch(err => console.log(err))
        }).catch(err => console.log(err))
    }, endTime - startTime)
}

exports.update = async (req, res) => {
    await Game.findByPk(req.body.game_id).then(async v => {
        if (!v) {
            return responses.notFoundError('The Game With This Identification Cannot Be Found')
        }
        else {
            await v.update(req.body).catch(err => responses.serverError(res, err)).then(() => {
                responses.blankSuccess()
            })
        }
    }).catch(err => responses.serverError(res, err))
}

exports.show = async (req, res) => {
    await Game.findOne({
        where: { id: req.params.id },
        attributes: ['name', 'id', 'prize', 'active', 'charge', 'winning_numbers', 'same_time', 'total_numbers', 'opening_time', 'closing_time', 'description', 'notes', 'winning_image', 'winner_announcement'],
        include: [
            { model: Category, attributes: ['uId', 'name', 'image'] },
            { model: EnabledGame, attributes: ['createdAt'] },
            { model: GameIteration, attributes: ['id'], limit: 1, order: [['createdAt', 'DESC']], include: { model: Winner } },
            { model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'] }
        ]
    })
        .then(v => v ? responses.dataSuccess(res, v) : responses.notFoundError('The Game With This Identification Cannot Be Found.'))
        .catch(err => responses.serverError(res, err))
}

exports.iterations = async (req, res) => {
    await GameIteration.findAll({ where: { game_id: req.params.game_id }, include: { model: Winner } }).then(v => {
        responses.dataSuccess(res, v)
    }).catch(err => responses.serverError(res, err))
}

exports.destroy = async (req, res) => {
    let game = new Game()
    game = req.body.Game
    try {
        await game.destroy().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
    }
    catch (err) {
        responses.serverError(res, "Please Delete The Enabled Game Before Deleting This Game")
    }
}

exports.enabledIndex = async (req, res) => {
    await EnabledGame.findAll({
        include: {
            model: Game,
            attributes: ['name', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'id', 'active', 'same_time'],
            include: [
                { model: Category, attributes: ['uId', 'name', 'image'], order: [['createdAt', 'DESC']] },
                { model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'] }
            ]
        },
        attributes: ['createdAt', 'id']
    }).then(v => responses.dataSuccess(res, v)).catch(err => responses.serverError(res, err))
}

exports.enabledStore = async (req, res) => {
    const enabledGame = EnabledGame.build(req.body)
    const iteration = new GameIteration()
    iteration.game_id = req.body.game_id
    iteration.id = helper.createId()
    await iteration.save().then(async () => {
        await enabledGame.save().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
    }).catch(err => responses.serverError(res, err))
}

exports.enabledDestroy = async (req, res) => {
    let enabledGame = new EnabledGame()
    enabledGame = req.body.EnabledGame
    await enabledGame.destroy().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}

exports.addWinningNumber = async (req, res) => {
    await GameIteration.findOne({ where: { id: req.body.iteration_id } }).then(async v => {
        if (v) {
            v.winning_number = req.body.winning_number
            await v.save().then(() => {
                responses.blankSuccess(res)
            }).catch(err => {

                responses.serverError(res, err)
            })
        }
        else responses.notFoundError(res, 'The Iteration With This Id Cannot Be Found.')

    }).catch(err => responses.serverError(res, err))
}

exports.alternateStore = async (req, res) => {
    const body = req.body
    const game = Game.build(body)
    await game.save().then(async g => {
        const alternateGame = AlternateGame.build({
            game_id: g.id,
            required_participants: body.required_participants,
        })
        await alternateGame.save().then(async ag => {
            body.Images.forEach(async image => {
                const img = await fileHandler.addImage(image)
                const agImage = AlternateGameImage.build({
                    alternate_game_id: ag.id,
                    image: img
                })
                await agImage.save().catch(err => console.log(err))
                responses.blankSuccess(res)
            })
        }).catch(err => responses.serverError(res, err))
    }).catch(err => responses.serverError(res, err))
}