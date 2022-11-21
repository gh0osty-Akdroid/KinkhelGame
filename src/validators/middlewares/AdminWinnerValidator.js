const { check, validationResult } = require("express-validator");
const isBase64 = require("is-base64");
const Game = require("../../models/Game");
const Winner = require("../../models/Winner");
const { validatonError } = require("../../utils/responses")
const helper = require('../../utils/helper');
const GameIteration = require("../../models/GameIteration");

exports.store = [
    check('name').notEmpty().withMessage('The Winner Name Cannot Be Empty').bail(),
    check('image').notEmpty().withMessage('The Image Field Cannot Be Empty').bail()
        .custom(async val => {
            if (await !isBase64(val)) {
               
                return Promise.reject()
            }
            else {
                return true
            }
        }).withMessage('Please Upload A Valid Image').bail(),
    check('iteration_id').isNumeric().withMessage('The Game Identification Must Be Valid.').bail()
        .custom(async (val, { req }) => {
            const id = helper.createId()
            const check = await Game.findOne({ include: { model: GameIteration, where: { id: val } } })
            if (!check) return Promise.reject()
            req.body.Game = check
            req.body.id = id
        }).withMessage('The Game With This Identification Cannot Be Found.').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]

exports.update = [
    check('name').notEmpty().withMessage('The Winner Name Cannot Be Empty').bail(),
    check('image').notEmpty().withMessage('The Image Field Cannot Be Empty').bail()
        .custom(async val => {
            if (await !isBase64(val)) {
                return Promise.reject()
            }
        }).withMessage('Please Upload A Valid Image').bail(),
    check('iteration_id').isNumeric().withMessage('The Game Identification Must Be Valid.').bail()
        .custom(async (val, { req }) => {
            const id = helper.createId()
            const check = await Game.findOne({ include: { model: GameIteration, where: { game_id: val } } })
            if (!check) return Promise.reject()
            req.body.Game = check
            req.body.id = id
        }).withMessage('The Game With This Identification Cannot Be Found.').bail(),
    check('info').notEmpty().withMessage('The Info Of The Winner Cannot Be Empty').bail(),
    check('date_time').notEmpty().withMessage('The Date And Time Of The Game Cannot Be Empty').bail(),
    check('index').isNumeric().withMessage('The Index Of The Winner Cannot Be Empty').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]

exports.destroy = [
    check('id').isNumeric().withMessage('A Valid Identification Must Be Present').bail()
        .custom(async (val, { req }) => {
            const check = await Winner.findByPk(val)
            if (!check) return Promise.reject()
            req.body.Winner = check
        }).withMessage('A Valid Identification Must Be Present').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]