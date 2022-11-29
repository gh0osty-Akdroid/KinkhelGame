const express = require('express')
const routes = express.Router()

// controllers
const GameController = require('../controllers/GameController')
const UserGameController = require('../controllers/UserGameController')
const WinnerController = require('../controllers/WinnerController')

// validators
const UserGameValidator = require('../validators/middlewares/UserGameValidator')

module.exports = () => {

    routes.get('/games', GameController.index)
    routes.get('/games/alternate', GameController.alternateIndex)
    routes.get('/game/:id', GameController.show)

    routes.post('/play', UserGameValidator.store, UserGameController.store)
    routes.get('/play', UserGameController.show)

    routes.get('/winners', WinnerController.index)
    routes.get('/home/winners',WinnerController.homeIndex)
    routes.get('/iteration/:id',GameController.iteration)

    return routes
}