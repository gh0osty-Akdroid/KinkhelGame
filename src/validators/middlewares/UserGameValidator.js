const { check } = require("express-validator")
const AlternateGame = require("../../models/AlternateGame")
const EnabledGame = require("../../models/EnabledGame")
const Game = require("../../models/Game")
const UserGame = require("../../models/UserGame")
const helper = require('../../utils/helper')

exports.store = [
    check('user_id').optional({ checkFalsy: true }).isNumeric().withMessage('Please Enter A Valid User Id').bail(),
    check('game_id').isNumeric().withMessage('Please Enter A Valid Identification For Game.').bail()
        .custom(async (val, { req }) => {
            const check = await Game.findOne({ where: { id: val }, include: [{ model: EnabledGame }, { model: AlternateGame }] })
            if (!check || !check.EnabledGame) return Promise.reject()
            req.body.id = helper.createId()
            if (check.AlternateGame != null) {
                req.body.isAlternate = true
            }
            if (check.active) {
                return true
            }
            else {
                if (check.AlternateGame == null) return Promise.reject()
                else return true
            }
        }).withMessage('The Game With This Identification Cannot Be Found').bail()
        .custom(async (val, { req }) => {
            if (req.body.user_id) {
                try {
                    const check = await UserGame.findAll({ where: { user_id: req.body.user_id, game_id: val } })
                    let count = 0
                    await check.forEach(uGame => {
                        if (uGame.iteration_id == req.body.iteration_id) count = count + 1
                    })
                    if (count > 0) return Promise.reject()
                }
                catch (err) {
                    console.log(err);
                }
            }

            // Check if iteration id is last. If last and is more than one than show error

        }).withMessage('You Have Already Played This Game').bail(),
    check('iteration_id').notEmpty().withMessage('Please Enter An Iteration Id For The Game.').bail(),
    check('merchant_id').optional({ checkFalsy: true }).isNumeric().withMessage('Please Enter A Valid Merchant Id').bail(),
    check('chosen_number').notEmpty().withMessage('Please Enter Chosen Number For The Game').bail()
        .custom(val => {
            const items = val.split('-')
            if (items.length > 5) return false
            items.forEach(numbers => {
                if (numbers.split(',').length >= 3) return false
            })
            return true
        }).withMessage('Please Choose Valid Numbers.').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]
