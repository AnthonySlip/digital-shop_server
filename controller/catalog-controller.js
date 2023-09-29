const catalogService = require('../service/catalog-service')
const apiError = require('../error/api-error')
class catalogController {
    async getItem (req, res, next) {
        try {
            const id = req.param('id')
            if (!id) throw apiError.BadRequest('Empty device id')
            const response = await catalogService.getItem(id)
            return res.json(response)
        } catch (err) {
            next(err)
        }
    }
    async getCatalog (req, res, next) {
        try {
            const response = await catalogService.getCatalog()
            return res.json(response)
        } catch (err) {
            next(err)
        }
    }
    getDevices (req, res, next) {
        try {
            const from = req.param('from')
            const to = req.param('to')
            if  (!from || !to) throw apiError.BadGateway('Invalid req url')
            const list = catalogService.getDevices(from , to)
            return res.json(list)
        } catch (err) {
            next(err)
        }
    }
    async getBrand (req, res, next) {
        try {
            const brandName = req.param('brand')
            if (!brandName) throw apiError.BadGateway('Invalid brand name')
            const list = await catalogService.getBrand(brandName)
            return res.json(list)
        } catch (err) {
            next(err)
        }
    }
    async getType (req, res, next) {
        try {
            const typeName = req.param('type')
            if (!typeName) throw apiError.BadGateway('Invalid type name')
            const list = await catalogService.getType(typeName)
            return res.json(list)
        } catch (err) {
            next(err)
        }
    }
    async getBrands (req, res, next) {
        try {
            const list = await catalogService.getBrands()
            return res.json(list)
        } catch (err) {
            next(err)
        }
    }
    async getTypes (req, res, next) {
        try {
            const list = await catalogService.getTypes()
            return res.json(list)
        } catch (err) {
            next(err)
        }
    }
    async getOptions (req, res, next) {
        try {
            const list = await catalogService.getOptions()
            return res.json(list)
        } catch (err) {
            next(err)
        }
    }
    async getFilltered (req, res, next) {
        try {
            const {type, brand, option} = req.body
            if (!type.length && !brand.length && !option.length) throw apiError.BadGateway('Invalid filter options')
            const list = await catalogService.getFilltered(type, brand, option)
            return res.json(list)
        } catch (err) {
            next(err)
        }
    }
    async createNewItem (req, res, next) {
        try {
            const {device, options} = req.body
            if (!device) throw apiError.BadRequest('Invalid device data')
            const result = await catalogService.createNewItem(device, options)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async getSearched (req, res, next) {
        try {
            const {array} = req.body
            if (!array.length) throw apiError.BadRequest('Invalid search')
            const result = await catalogService.getSearched(array)
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new catalogController()