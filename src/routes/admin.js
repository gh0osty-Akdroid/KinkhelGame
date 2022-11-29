const express = require('express')
const routes = express.Router()

// controllers
const ApiController = require('../controllers/ApiController')
const CategoryController = require('../controllers/admin/AdminCategoryController')
const GameController = require('../controllers/admin/AdminGameController')
const UserGameController = require('../controllers/admin/AdminUserGameController')
const WinnerController = require('../controllers/admin/AdminWinnerController')
const GameNumberController = require('../controllers/admin/AdminGameNumberController')
const WinnerAnnoucementController = require('../controllers/admin/AdminWinnerAnnouncementController')

// validators
const CategoryValidator = require('../validators/middlewares/AdminCategoryValidator')
const WinnerValidator = require('../validators/middlewares/AdminWinnerValidator')
const GameValidator = require('../validators/middlewares/AdminGameValidator')
const GameNumberValidator = require('../validators/middlewares/AdminGameNumberValidator')
const WinnerAnnoucementValidator = require('../validators/middlewares/AdminWinnerAnnoucementValidator')

module.exports = () => {

    routes.get('/', ApiController.index)

    routes.get('/categories', CategoryController.index)
    routes.get('/category/:id', CategoryController.show)
    routes.post('/categories', CategoryValidator.store, CategoryController.store)
    routes.put('/categories', CategoryValidator.update, CategoryController.update)
    routes.delete('/categories', CategoryValidator.destroy, CategoryController.destroy)

    routes.get('/winners/:iteration', WinnerController.index)
    routes.post('/winners', WinnerValidator.store, WinnerController.store)
    routes.put('/winners', WinnerValidator.update, WinnerController.update)
    routes.delete('/winners', WinnerValidator.destroy, WinnerController.destroy)

    routes.get('/games', GameController.index)
    routes.get('/game/:id', GameController.show)
    routes.post('/games', GameValidator.store, GameController.store)
    routes.put('/games', GameValidator.update, GameController.update)
    routes.delete('/games', GameValidator.destroy, GameController.destroy)
    routes.post('/games/alternate', GameValidator.alternateStore, GameController.alternateStore)
    routes.get('/games/alternate', GameController.alternateIndex)

    routes.get('/games/enabled', GameController.enabledIndex)
    routes.post('/games/enabled', GameValidator.enabledStore, GameController.enabledStore)
    routes.delete('/games/enabled', GameValidator.enabledDestroy, GameController.enabledDestroy)

    routes.get('/play/:game/:user', UserGameController.show)
    routes.get('/userGame/game/:id', UserGameController.game)
    routes.get('/userGame/user/:id', UserGameController.user)
    routes.get('/userGame/merchant/:id', UserGameController.merchant)

    routes.get('/iterations/:game_id', GameController.iterations)
    routes.post('/iterations', GameController.addWinningNumber)

    // routes.get('/gameNumbers/:id', GameNumberController.index)
    // routes.post('/gameNumbers/:id', GameNumberController.show)

    routes.put('/winnerAnnouncement', WinnerAnnoucementValidator.update, WinnerAnnoucementController.update)
    routes.delete('/winnerAnnouncement', WinnerAnnoucementValidator.destroy, WinnerAnnoucementController.destroy)
    routes.post('/findWinner/:iteration', WinnerAnnoucementController.checkWinner)

    return routes
}