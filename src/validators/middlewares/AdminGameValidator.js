const { check } = require("express-validator");
const responses = require('../../utils/responses')
const helper = require('../../utils/helper');
const Category = require("../../models/Category");
const Game = require("../../models/Game");
const EnabledGame = require("../../models/EnabledGame");

exports.store = [
    check('name').notEmpty().withMessage('The Name of The Game Cannot Be Empty').bail(),
    check('prize').notEmpty().withMessage('The Prize of The Game Cannot Be Empty').bail(),
    check('category').notEmpty().withMessage('The Category Cannot Be Empty').bail()
        .custom(async (val, { req }) => {
            const check = await Category.findOne({ where: { uId: val } })
            if (!check) return Promise.reject()
            req.body.category_id = check.id
            req.body.id = helper.createId()
        }).withMessage('The Category With This Identification Cannot Be Found.').bail(),
    check('charge').isNumeric().withMessage('Please Enter A Valid Charge For This Game.').bail(),
    check('total_numbers').notEmpty().withMessage('Please Enter Total Numbers.').bail()
        .custom((val) => {
            if (val.split('-').length !== 2) return Promise.reject()
            else return true

        }).withMessage('Please Enter Valid Total Numbers').bail(),
    check('winning_numbers').notEmpty().withMessage('The Winning Numbers Cannot Be Empty.').bail()
        .custom((val, { req }) => {
            const items = val.split(',')
            if (items.length > 2) return true
            else return false
        }).withMessage('Please Enter A Valid Winning Numbers. Note: The Winning Numbers Must Be Less Than Provided Total Number').bail(),
    check('opening_time').notEmpty().withMessage('The Opening Date & Time Cannot Be Empty').bail()
        .custom((val, { req }) => {
            // Currently Can Be Only Greater Than 24
            const date = new Date(val)
            const currentDate = new Date()
            const ms = date.getTime() - currentDate.getTime()
            if (ms > 0 && ms < 2147483640) {
                req.body.startTime = ms
                return true
            }
            else return Promise.reject()
        }).withMessage('Please Enter A Valid Opening Time').bail(),
    check('closing_time').notEmpty().withMessage('The Closing Date & Time Cannot Be Empty').bail()
        .custom((val, { req }) => {
            const date = new Date(val)
            const currentDate = new Date()
            const startTime = req.body.startTime
            const ms = date.getTime() - currentDate.getTime()
            if (ms > 0 && ms < 2147483640 * 2 && ms > startTime) {
                req.body.endTime = ms
                return true
            }
            else return Promise.reject()
        }).withMessage('Please Enter A Valid Closing Time').bail(),
    check('description').isLength({ min: 5 }).withMessage('Please Enter A Description For THis Game.').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]

exports.update = [
    check('name').notEmpty().withMessage('The Name of The Game Cannot Be Empty').bail(),
    check('prize').notEmpty().withMessage('The Prize of The Game Cannot Be Empty').bail(),
    check('charge').isNumeric().withMessage('The Charge of The Game Cannot Be Empty').bail(),
    check('id').isNumeric().withMessage('Please Enter A Valid Identification.').bail()
        .custom(async (val, { req }) => {
            const check = await Game.findByPk(val)
            if (!check) return Promise.reject()
            req.body.Game = check
        }).withMessage('The Game With This Identificaiton Cannot Be Found').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]

exports.destroy = [
    check('id').isNumeric().withMessage('Please Enter A Valid Identification.').bail()
        .custom(async (val, { req }) => {
            const check = await Game.findByPk(val)
            if (!check) return Promise.reject()
            req.body.Game = check
        }).withMessage('The Game With This Identificaiton Cannot Be Found').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]

exports.enabledStore = [
    check('game_id').isNumeric().withMessage('Please Enter A Valid Identification.').bail()
        .custom(async (val, { req }) => {
            const check = await Game.findByPk(val)
            req.body.id = helper.createId()
            if (!check) return Promise.reject()
            else {
                const check2 = await EnabledGame.findOne({ where: { game_id: val } })
                if (check2) return Promise.reject()
            }
        }).withMessage('No Disabled Game With This Identificaiton Can Be Found').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]

exports.enabledDestroy = [
    check('game_id').isNumeric().withMessage('Please Enter A Valid Identification.').bail()
        .custom(async (val, { req }) => {
            const check = await EnabledGame.findOne({ where: { game_id: val } })
            if (!check) return Promise.reject()
            req.body.EnabledGame = check
        }).withMessage('No Enabeled Game With This Identification Can Be Found').bail(),

    (req, res, next) => helper.validationError(req, res, next)

]