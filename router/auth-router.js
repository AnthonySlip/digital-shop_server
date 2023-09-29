const express = require('express')
const Router = express.Router
const authController = require('../controller/auth-controller')
const authMiddleware = require('../middleware/auth-middleware')

const authRouter = new Router()

authRouter.post('/sign-up', authController.signUp)
authRouter.post('/log-in', authController.logIn)
authRouter.post('/sign-out', authMiddleware, authController.signOut)
authRouter.post('/update-data/:id', authMiddleware, authController.updateData)

authRouter.get('/refresh', authController.getToken)

module.exports = authRouter