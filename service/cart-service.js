const {Device, Type, Brand, Option, DeviceOption, Basket, Saved} = require('../model/models')
const {where, Op} = require("sequelize")
const apiError = require('../error/api-error')

class cartService {
    async getBasket (userId) {
        try {
            const basket = await Basket.findOne({where: {UserId: userId}})
            if (!basket) throw apiError.BadRequest('Invalid user id')

            const devices = []
            for (const item of basket.list) {
                const device = await Device.findByPk(item)
                const brand = await Brand.findByPk(device.BrandId)
                const type = await Type.findByPk(device.TypeId)
                devices.push({...JSON.parse(JSON.stringify(device)), brand: brand.name, type: type.name})
            }
            return devices
        } catch (err) {
            throw err
        }
    }
    async getFavorite (userId) {
        try {
            const saved = await Saved.findOne({where: {UserId: userId}})
            if (!saved.list) return []
            if (!saved) throw apiError.BadRequest('Invalid user id')
            const devices = []
            for (const item of saved.list) {
                const device = await Device.findByPk(item)
                const brand = await Brand.findByPk(device.BrandId)
                const type = await Type.findByPk(device.TypeId)
                devices.push({...JSON.parse(JSON.stringify(device)), brand: brand.name, type: type.name})
            }
            return devices
        } catch (err) {
            throw err
        }
    }
    async pushBasket (deviceId, userId) {
        try {
            const basket = await Basket.findOne({where: {UserId: userId}})
            if (!basket) throw apiError.BadRequest('Invalid user id')

            if (!basket.list.length) {
                basket.list = []
                basket.list = [deviceId]
            }
            else {
                basket.list = [...basket.list, deviceId]
            }
            await basket.save()

            const device = await Device.findByPk(deviceId)
            return device
        } catch (err) {
            throw err
        }
    }
    async removeItemBasket (deviceId, userId) {
        try {
            const basket = await Basket.findOne({where: {UserId: userId}})
            if (!basket) throw apiError.BadRequest('Invalid user id')

            basket.list = basket.list.filter(item => item!==deviceId)

            const item = await basket.save()
            return item
        } catch (err) {
            throw err
        }
    }
    async deleteBasket (userId) {
        try {
            const basket = await Basket.findOne({where: {UserId: userId}})
            if (!basket) throw apiError.BadRequest('Invalid user id')

            basket.list = []

            const item = await basket.save()
            return item
        } catch (err) {
            throw err
        }
    }
    async pushFavorite (deviceId, userId) {
        try {
            const saved = await Saved.findOne({where: {UserId: userId}})
            if (!saved) throw apiError.BadRequest('Invalid user id')

            if (!saved.list.length) {
                saved.list = []
                saved.list = [deviceId]
            } else {
                saved.list = [...saved.list, deviceId]
            }
            await saved.save()

            const device = await Device.findByPk(deviceId)
            return device
        } catch (err) {
            throw err
        }
    }
    async removeItemFavorite (deviceId, userId) {
        try {
            const saved = await Saved.findOne({where: {UserId: userId}})
            if (!saved) throw apiError.BadRequest('Invalid user id')

            saved.list = saved.list.filter(item => item!==deviceId)

            const item = await saved.save()
            return item
        } catch (err) {
            throw err
        }
    }
    async deleteFavorite (userId) {
        try {
            const saved = await Saved.findOne({where: {UserId: userId}})
            if (!saved) throw apiError.BadRequest('Invalid user id')

            saved.list = []

            const item = await saved.save()
            return item
        } catch (err) {
            throw err
        }
    }
}

module.exports = new cartService()