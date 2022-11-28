const Category = require("../models/Category")
const Game = require("../models/Game")
const Winner = require("../models/Winner")
const responses = require('../utils/responses')

exports.index = async (req, res) => {
    let site = req.query.site
    let where = {}
    if (site) {
        where.region = site
    }
    await Winner.findAll({
        attributes: ['image', 'name', 'info', 'index', 'other'],
        order: [['createdAt', 'DESC']],
        include: {
            model: Game, attributes: ['id'],
            include: { model: Category, attributes: ['name', 'image'], where: where }
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
                    if (win.length <= 5) {
                        win.push(winner)
                    }
                }
            })
        })

        responses.dataSuccess(res, allWinners)
    }).catch(err => responses.serverError(res, err))
}

exports.homeIndex = async (req, res) => {
    await Winner.findAll({
        attributes: ['image', 'name', 'info', 'index', 'other'],
        limit: 10,
        order: [['createdAt', 'DESC']]
    }).then(winners => {
        responses.dataSuccess(res, winners)
    }).catch(err => responses.serverError(res, err))
}