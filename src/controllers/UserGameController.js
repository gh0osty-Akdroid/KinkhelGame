const AlternateGame = require('../models/AlternateGame')
const Category = require('../models/Category')
const Game = require('../models/Game')
const GameIteration = require('../models/GameIteration')
const UserGame = require('../models/UserGame')
const responses = require('../utils/responses')

exports.store = async (req, res) => {
    const userGame = UserGame.build(req.body)
    await userGame.save().then(() => responses.blankSuccess(res)).catch(err => responses.serverError(res, err))
}

exports.participateStore = async(req,res)=> {
    
}

exports.show = async (req, res) => {
    await UserGame.findAll({
        where: { user_id: req.params.user },
        attributes: ['chosen_number', 'merchant_id'],
        include: {
            model: Game,
            attributes: ['name', 'id', 'prize', 'charge', 'total_numbers', 'opening_time', 'closing_time', 'description', 'notes', 'winning_image'],
            include: [
                { model: Category, attributes: ['uId', 'name'] },
                { model: AlternateGame, attributes: ['required_participants', 'active_participants', 'image'] }
            ]
        }
    }).then(v => v ? responses.dataSuccess(res, v) : responses.notFoundError('No Data Found On Provided Condition'))
        .catch(err => responses.serverError(res, err))
}