const { check, validationResult } = require("express-validator");
const isBase64 = require('is-base64')
const responses = require('../../utils/responses')
const helper = require('../../utils/helper');
const Category = require("../../models/Category");

exports.store = [
    check('name').notEmpty().withMessage('The Category Name Cannot Be Empty').bail()
        .custom(async (val, { req }) => {
            const uId = helper.encode(val)
            const check = await Category.findOne({ where: { uId: uId } })
            if (check) return Promise.reject()
            req.body.uId = uId
            req.body.id = helper.createId()
        }).withMessage('Please Enter A Unique Category Name.').bail(),
    check('image').notEmpty().withMessage('The Image Field Cannot Be Empty').bail()
        .custom(async val => {
            if (await !isBase64(val)) {
                return Promise.reject()
            }
        }).withMessage('Please Upload A Valid Image').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]

exports.update = [
    check('name').notEmpty().withMessage('The Category Name Cannot Be Empty').bail()
        .custom(async (val, { req }) => {
            const uId = helper.encode(val)
            const tId = parseInt(req.body.id)
            const check = await Category.findOne({ where: { uId: uId } })
            if (check && check.id !== tId) return Promise.reject()
            req.body.uId = uId
            req.body.id = tId
        }).withMessage('Please Enter A Unique Category Name.').bail(),
    // check('image').notEmpty().withMessage('The Image Field Cannot Be Empty').bail()
    //     .custom(async val => {
    //         // if (await !isBase64(val)) {
    //         //     return Promise.reject()
    //         // }
    //     }).withMessage('Please Upload A Valid Image').bail(),
    check('id').isNumeric().withMessage('A Valid Identification Must Be Present').bail()
        .custom(async (val, { req }) => {
            const check = await Category.findByPk(val)
            if (!check) return Promise.reject()
            req.body.Cat = check
        }).withMessage('A Valid Identification Must Be Present').bail(),
    check('enabled').isBoolean().withMessage('The Enabled Field Must Be Valid & Present').bail(),

    (req, res, next) => helper.validationError(req, res, next)

]

exports.destroy = [
    check('id').isNumeric().withMessage('A Valid Identification Must Be Present').bail()
        .custom(async (val, { req }) => {
            const check = await Category.findByPk(val)
            if (!check) return Promise.reject()
            req.body.Cat = check
        }).withMessage('A Valid Identification Must Be Present').bail(),

    (req, res, next) => helper.validationError(req, res, next)
]