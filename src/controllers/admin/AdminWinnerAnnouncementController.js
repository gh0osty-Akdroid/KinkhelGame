const Game = require("../../models/Game");
const GameIteration = require("../../models/GameIteration");
const UserGame = require("../../models/UserGame");
const responses = require('../../utils/responses')

exports.update = async (req, res) => {
    console.log(req.body);
    updateTime(req.body.time, req, res)
}

exports.destroy = async (req, res) => {
    updateTime(null, req, res)
}

const updateTime = async (time, req, res) => {
    let game = new Game()
    game = req.body.Game
    game.winner_announcement = time
    await game.save().then(v => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}

exports.checkWinner = async (req, res) => {
    await UserGame.findAll({ where: { iteration_id: req.params.iteration } }).then(v => {
        let count = 0
        if (v.length > 0) {
            v.forEach(userGame => {
                if (userGame.chosen_number.includes(req.body.number)) {
                    count++
                }
            })
            responses.dataSuccess(res, count)
        }
        else responses.dataSuccess(res, count)

    }).catch(err => responses.serverError(res, err))
}