const e = require("cors")
const AlternateGame = require("../../models/AlternateGame")
const Category = require("../../models/Category")
const EnabledGame = require("../../models/EnabledGame")
const Game = require("../../models/Game")
const responses = require('../../utils/responses')
const fileHandler = require('../../utils/fileHandler')
const helper = require('../../utils/helper')
const GameIteration = require("../../models/GameIteration")

exports.index = async (req, res) => {
    await Game.findAndCountAll({
        attributes: ['name', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'id', 'active', 'same_time'],
        include: [
            { model: Category, attributes: ['uId', 'name'], order: [['createdAt', 'DESC']] },
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
    responses.blankSuccess()
}

exports.show = async (req, res) => {
    await Game.findOne({
        where: { id: req.params.id },
        attributes: ['name', 'id', 'prize', 'active', 'charge', 'winning_numbers', 'same_time', 'total_numbers', 'opening_time', 'closing_time', 'description', 'notes', 'winning_image'],
        include: [
            { model: Category, attributes: ['uId', 'name'] },
            { model: EnabledGame, attributes: ['createdAt'] },
            { model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'] }
        ]
    })
        .then(v => v ? responses.dataSuccess(res, v) : responses.notFoundError('The Game With This Identification Cannot Be Found.'))
        .catch(err => responses.serverError(res, err))
}

exports.destroy = async (req, res) => {
    let game = new Game()
    game = req.body.Game
    await game.destroy().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}

exports.enabledIndex = async (req, res) => {
    await EnabledGame.findAll({
        include: {
            model: Game,
            attributes: ['name', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'id', 'active', 'same_time'],
            include: [
                { model: Category, attributes: ['uId', 'name'], order: [['createdAt', 'DESC']] },
                { model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'] }
            ]
        },
        attributes: ['createdAt']
    }).then(v => responses.dataSuccess(res, v)).catch(err => responses.serverError(res, err))
}

exports.enabledStore = async (req, res) => {
    const enabledGame = EnabledGame.build(req.body)
    await enabledGame.save().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}

exports.enabledDestroy = async (req, res) => {
    let enabledGame = new EnabledGame()
    enabledGame = req.body.EnabledGame
    await enabledGame.destroy().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}
