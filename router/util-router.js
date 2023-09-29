const express = require('express')
const Router = express.Router
const locationController = require('../controller/util-controller')
const utilRouter = new Router()

utilRouter.get('/city/:latitude/:longitude', locationController.getCity)
utilRouter.get('/main', locationController.getMainData)

module.exports = utilRouter