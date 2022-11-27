const Category = require("../models/Category")
const Game = require("../models/Game")
const Winner = require("../models/Winner")
const responses = require('../utils/responses')

exports.index = async (req, res) => {
    await Winner.findAll({
        attributes: ['image', 'name', 'info', 'index', 'other'],
        include: {
            model: Game, attributes: ['id'],
            include: { model: Category, attributes: ['name', 'image'] }
        }
    }).then(winners => {
        const categories = []
        const allWinners = []
        winners.forEach(winner => {
            const wins = []
            let catName = winner.Game.Category.name
            console.log(catName);
            if (!categories.includes(catName)) {
                console.log(catName)
                categories.push(catName)
                wins.push(winner)
                let win = { categeory: catName, winners: wins }
                allWinners.push(win)
            }
            else{
                console.log('pok');
            }
        })

        responses.dataSuccess(res, winners)
    }).catch(err => responses.serverError(res, err))
}

