const Game = require("../../models/Game")
const Winner = require("../../models/Winner")
const { dataSuccess, serverError, blankSuccess } = require("../../utils/responses")
const fileHandler = require("../../utils/fileHandler")

exports.index = async (req, res) => {
    await Winner.findAll({
        attributes: ['name', 'info', 'image', 'month', 'index', 'day'], order: [['index', 'DESC']],
        where: { iteration_id: req.params.iteration },
        include: { model: Game, attributes: ['name'] }
    }).then(v => dataSuccess(res, v)).catch(err => serverError(res, err))
}

exports.store = async (req, res) => {
    const winner = Winner.build(req.body)
    winner.game_id = req.body.Game.id
    winner.image = await fileHandler.addImage(req.body.image)
    await winner.save().then(() => blankSuccess(res)).catch(err => serverError(res, err))
}

exports.update = async (req, res) => {
    // TODO:: UPDATE GARNU PARYO
}

exports.destroy = async (req, res) => {
    let winner = new Winner()
    winner = req.body.Winner
    await winner.destroy().then(() => blankSuccess(res)).catch(err => serverError(res, err))
}