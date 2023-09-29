const cartService = require('../service/cart-service')
const apiError = require('../error/api-error')
class cartController {
    async getBasket (req, res, next) {
        try {
            const userId = req.param('user')
            if (!userId) return apiError.BadRequest('Invalid user')
            const result = await cartService.getBasket(userId)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async getFavorite (req, res, next) {
        try {
            const userId = req.param('user')
            if (!userId) return apiError.BadRequest('Invalid user')
            const result = await cartService.getFavorite(userId)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async pushBasket (req, res, next) {
        try {
            const {deviceId, userId} = req.body
            if (!deviceId || !userId) throw apiError.BadRequest('Empty device or user id')
            const result = await cartService.pushBasket(deviceId, userId)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async removeItemBasket (req, res, next) {
        try {
            const {deviceId, userId} = req.body
            if (!deviceId || !userId) throw apiError.BadRequest('Empty device or user id')
            const result = await cartService.removeItemBasket(deviceId, userId)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async deleteBasket (req, res, next) {
        try {
            const {userId} = req.body
            if (!userId) throw apiError.BadRequest('Empty user id')
            const result = await cartService.deleteBasket(userId)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async pushFavorite (req, res, next) {
        try {
            const {deviceId, userId} = req.body
            if (!deviceId || !userId) throw apiError.BadRequest('Empty device or user id')
            const result = await cartService.pushFavorite(deviceId, userId)
            return res.json(result)
        } catch (err) {
            next(err)
        } // Выенесть Basket и Favorite отдельно (и на сервере и на клиенте)
    }
    async removeItemFavorite (req, res, next) {
        try {
            const {deviceId, userId} = req.body
            if (!deviceId || !userId) throw apiError.BadRequest('Empty device or user id')
            const result = await cartService.removeItemFavorite(deviceId, userId)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async deleteFavorite (req, res, next) {
        try {
            const {userId} = req.body
            if (!userId) throw apiError.BadRequest('Empty device or user id')
            const result = await cartService.deleteFavorite(userId)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new cartController()