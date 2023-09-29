const express = require('express')
const Router = express.Router
const cartController = require('../controller/cart-controller')
const authMiddleware = require('../middleware/auth-middleware')
const cartRouter = new Router()

cartRouter.get('/getBasket/:user', authMiddleware, cartController.getBasket)
cartRouter.get('/getFavorite/:user', authMiddleware, cartController.getFavorite)

cartRouter.post('/pushBasket', authMiddleware, cartController.pushBasket)
cartRouter.post('/pushFavorite', authMiddleware, cartController.pushFavorite)

cartRouter.post('/removeItemBasket', authMiddleware, cartController.removeItemBasket)
cartRouter.post('/removeItemFavorite', authMiddleware, cartController.removeItemFavorite)

cartRouter.post('/deleteBasket', authMiddleware, cartController.deleteBasket)
cartRouter.post('/deleteFavorite', authMiddleware, cartController.deleteFavorite)

module.exports = cartRouter