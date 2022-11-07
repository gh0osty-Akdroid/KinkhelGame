const { check } = require("express-validator")
const helper = require('../../utils/helper')
const EnabledGame = require("../../models/EnabledGame")
const Game = require("../../models/Game")

exports.update = [
    check('time').notEmpty().withMessage('The Time Cannot Be Empty').bail(),

    check('game_id').isNumeric().withMessage('Please Enter A Valid Identification For Game.').bail()
        .custom(async (val, { req }) => {
            const check = await Game.findOne({ where: { id: val }, include: { model: EnabledGame } })
            if (!check || !check.EnabledGame) return Promise.reject()
            req.body.Game = check
            return true
        }).withMessage('The Game With This Identification Cannot Be Found').bail(),

    (req, res, next) => helper.validationError(req, res, next)

]

exports.destroy = [

    check('game_id').isNumeric().withMessage('Please Enter A Valid Identification For Game.').bail()
        .custom(async (val, { req }) => {
            const check = await Game.findOne({ where: { id: val }, include: { model: EnabledGame } })
            if (!check || !check.EnabledGame) return Promise.reject()
            if (check.active) {
                req.body.Game = check
                return true
            }
            else return Promise.reject()
        }).withMessage('The Game With This Identification Cannot Be Found').bail(),

    (req, res, next) => helper.validationError(req, res, next)

]
