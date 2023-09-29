const express = require('express')
const Router = express.Router
const catalogController = require('../controller/catalog-controller')
const roleMiddleware = require('../middleware/role-middleware')
const catalogRouter = new Router()

catalogRouter.get('/item/:id', catalogController.getItem)
catalogRouter.get('/all-list', catalogController.getCatalog)
catalogRouter.get('/from-to-list/:from/:to', catalogController.getDevices)
catalogRouter.get('/brands-list/:brand', catalogController.getBrand)
catalogRouter.get('/types-list/:type', catalogController.getType)
catalogRouter.get('/brands', catalogController.getBrands)
catalogRouter.get('/types', catalogController.getTypes)
catalogRouter.get('/options', catalogController.getOptions)

catalogRouter.post('/filter', catalogController.getFilltered)
catalogRouter.post('/search', catalogController.getSearched)
catalogRouter.post('/post', roleMiddleware, catalogController.createNewItem)

module.exports = catalogRouter