const Category = require("../models/Category")
const Game = require("../models/Game")
const Winner = require("../models/Winner")
const responses = require('../utils/responses')

exports.index = async (req, res) => {
    await Winner.findAll({
        attributes: ['image', 'name', 'info', 'index', 'other'],
        order: [['createdAt', 'DESC']],
        include: {
            model: Game, attributes: ['id'],
            include: { model: Category, attributes: ['name', 'image'] }
        }
    }).then(winners => {
        const categories = []
        const allWinners = []
        winners.forEach(winner => {
            let catName = winner.Game.Category.name
            if (!categories.includes(catName)) {
                const win = { category: catName, winners: [] }
                allWinners.push(win)
                categories.push(catName)
            }
        })
        allWinners.forEach(aw => {
            winners.forEach(winner => {
                if (winner.Game.Category.name == aw.category) {
                    let win = aw.winners
                    win.push(winner)
                }
            })
        })

        responses.dataSuccess(res, allWinners)
    }).catch(err => responses.serverError(res, err))
}

