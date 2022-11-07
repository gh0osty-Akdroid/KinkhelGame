const Category = require('../models/Category')
const Game = require('../models/Game')
const UserGame = require('../models/UserGame')

const responses = require('../utils/responses')

exports.index = (req, res) => {
    
    responses.dataSuccess(res, `Welcome To Our Service`)
}