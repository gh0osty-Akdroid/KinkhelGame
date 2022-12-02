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
const { Op } = require("sequelize")

exports.index = async (req, res) => {
    let search = req.query.search
    let site = req.query.site
    let where = {}
    if (search) {
        where.name = { [Op.iLike]: `%${input}%` }
    }
    if (site) {
        where.region = site
    }
    await Game.findAndCountAll({
        attributes: ['name', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'id', 'active', 'same_time'],
        where: where,
        include: [
            { model: Category, attributes: ['uId', 'name', 'image'], order: [['createdAt', 'DESC']] },
            { model: AlternateGame },
            { model: EnabledGame, attributes: ['createdAt'] }
        ]
    }).then(v => {
        const g2 = []
        v.rows.forEach(game => {
            if (game.AlternateGame == null) g2.push(game)
        })
        v.rows = g2
        responses.dataSuccess(res, v)
    }).catch(err => responses.serverError(res, err))
}

exports.alternateIndex = async (req, res) => {
    let search = req.query.search
    let site = req.query.site
    let where = {}
    if (search) {
        where.name = { [Op.iLike]: `%${input}%` }
    }
    if (site) {
        where.region = site
    }
    await Game.findAndCountAll({
        attributes: ['name', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'id', 'active', 'same_time'],
        where: where,
        include: [
            {
                model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image', 'current_participants'], include:
                {
                    model: AlternateGameImage, attributes: ['image']
                }
            },
            { model: EnabledGame, attributes: ['createdAt'] }
        ]
    }).then(v => {
        const g2 = []
        v.rows.forEach(game => {
            if (game.AlternateGame != null) g2.push(game)
        })
        v.rows = g2
        responses.dataSuccess(res, v)
    }).catch(err => responses.serverError(res, err))
}

exports.store = async (req, res) => {
    const body = req.body
    const game = Game.build(body)
    await game.save().then(async (g) => {
        if (req.body.required_participants) {
            // const alternateGame = AlternateGame.build({
            //     game_id: g.id,
            //     required_participants: body.required_participants,
            // })
            // alternateGame.image = await fileHandler.addImage(req.body.image)
            // await alternateGame.save().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
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
    game.winning_number = "0,1,2"
    game.total_numbers = "0-1"
    game.allowed_numbers = 2
    game.opening_time = ""
    game.closing_time = ""
    await game.save().then(async g => {
        const alternateGame = AlternateGame.build({
            id: helper.createId(),
            game_id: g.id,
            required_participants: body.required_participants,
        })
        await alternateGame.save().then(async () => {
            body?.images.forEach(async e => {
                console.log('====================================');
                console.log(e);
                console.log('====================================');
                var img = await fileHandler.addImage(e)
                console.log('====================================');
                console.log(img);
                console.log('====================================');
                var image = await AlternateGameImage.build({ alternate_game_id: alternateGame.id, image: img })
                console.log('====================================');
                console.log(image);
                console.log('====================================');
                await image.save().catch(err=>console.log(err))
            })
            responses.blankSuccess(res)
        }).catch(err => responses.serverError(res, err))
    }).catch(err => responses.serverError(res, err))
}