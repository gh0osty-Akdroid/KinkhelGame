const helper = require('../../utils/helper')
const Game = require("../../models/Game")
const { check } = require("express-validator")

exports.show = (req, res) => [
    check('number').notEmpty().withMessage('The Number Cannot Be Empty').bail()
        .custom(val => {
            if (numbers.split(',').length >= 3) return false
            return true
        }).withMessage('Please Enter Valid Numbers.').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]