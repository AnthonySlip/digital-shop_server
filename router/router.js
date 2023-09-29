const express = require('express')
const Router = express.Router
const authRouter = require('../router/auth-router')
const catalogRouter = require('../router/catalog-router')
const utilRouter = require('./util-router')
const cartRouter = require('../router/cart-router')
const router = new Router()

router.use('/auth', authRouter)
router.use('/catalog', catalogRouter)
router.use('/util', utilRouter)
router.use('/cart', cartRouter)

module.exports = router