const { validationResult } = require("express-validator")
const randomstring = require("randomstring")
const slugify = require('slugify')
const responses = require('./responses')

exports.encode = (term) => {
    let uId = slugify(term, '-')
    uId.length > 50 ? uId = uId.substr(0, 49) : undefined
    return uId
}

exports.createId = () => parseInt(randomstring.generate({ length: 9, charset: 'numeric' }))

exports.validationError = (req, res, next) => {
    const err = validationResult(req)
    if (!err.isEmpty()) return responses.validatonError(res, err)
    next()
}