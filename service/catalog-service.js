const {Device, Type, Brand, Option, DeviceOption, Basket, Saved} = require('../model/models')
const {where, Op} = require("sequelize")
const apiError = require('../error/api-error')
class catalogService {
    async getItem (id) {
        try {
            const item = await Device.findByPk(id)
            if (!item) throw apiError.BadRequest('Invalid device id')
            const deviceOption = await DeviceOption.findAll({where: {DeviceId: id}})
            const options = []

            for (const el of deviceOption) {
                const option = await Option.findByPk(el.OptionId)
                options.push(option)
            }

            const type = await Type.findByPk(item.TypeId)
            const brand = await Brand.findByPk(item.BrandId)

            const device = {
                ...JSON.parse(JSON.stringify(item)),
                type: type.name,
                brand: brand.name,
            }

            return {device, options}
        } catch (err) {
            throw err
        }
    }
    async getCatalog () {
        try {
            const resDevices = await Device.findAll()
            const devices = JSON.parse(JSON.stringify(resDevices))

            const result= []

            for (const item of devices) {
                const deviceId = item.id
                const res = await DeviceOption.findAll({where: {DeviceId: deviceId}})
                const optionsId = JSON.parse(JSON.stringify(res))

                const Options = []

                for (const el of optionsId) {
                    const option = await Option.findByPk(el.OptionId)
                    Options.push(option)
                }

                result.push({
                    device: {...item},
                    options: [...Options]
                })

            }

            return result


        } catch (err) {
            throw  err
        }
    }
    getDevices (from ,to) {
        try {
            const list = Device.findAll()
            return list.slice(from, to)
        } catch (err) {
            throw err
        }
    }
    async getBrand (brandName) {
        try {
            const brand = await Brand.findOne({where: {name: brandName}})
            if (!brand) throw apiError.BadRequest('Invalid brand name')
            const list = await Device.findAll({where: {BrandId: brand.id}})
            return list
        } catch (err) {
            throw err
        }
    }
    async getType (typeName) {
        try {
            const type = await Type.findOne({where: {name: typeName}})
            if (!type) throw apiError.BadRequest('Invalid type name')
            const list = await Device.findAll({where: {TypeId: type.id}})
            return list
        } catch (err) {
            throw err
        }

    }
    async getBrands () {
        try {
            const brands = await Brand.findAll()
            return brands
        } catch (err) {
            throw err
        }
    }
    async getTypes () {
        try {
            const types = await Type.findAll()
            return types
        } catch (err) {
            throw err
        }
    }
    async getOptions() {
        try {
            const titlesRes = await Option.findAll()
            const titles = []
            titlesRes.forEach(item => {
                const el = {}
                el[item.title] = []

                const include = titles.filter(value => {
                    if (JSON.stringify(value) === JSON.stringify(el)) return value
                })

                if (!include.length) titles.push(el)
            })

            //description

            return titles.map(item => {
                const key = Object.keys(item)[0]

                for (const el of titlesRes) {
                    if (el.title === key) item[key].push(el.description)
                }

                return item
            })

        } catch (err) {
            throw err
        }
    }
    async brandId (brand) {
        const isBrand = await Brand.findOne({where: {name: brand}})
        if (isBrand) return isBrand.id
        const created = await Brand.create({name: brand})
        return created.id
    }
    async typeId (type) {
        const isType = await Type.findOne({where: {name: type}})
        if (isType) return isType.id
        const created = await Type.create({name: type})
        return created.id
    }
    async getFilltered (type, brand, option) {
        try {

            const Devices = await Device.findAll()

            const Types = []
            const Brands = []
            const Options = []

            if (type.length) for (const item of type) {
                const typeDB = await Type.findOne({where: {name: item}})
                if (typeDB) {
                    const devices = await Device.findAll({where: {TypeId: typeDB.id}})
                    Types.push(...devices.map(el => el.id))
                }
            }

            if (brand.length) for (const item of brand) {
                const brandDB = await Brand.findOne({where: {name: item}})
                if (brandDB) {
                    const devices = await Device.findAll({where: {BrandId: brandDB.id}})
                    Brands.push(...devices.map(el => el.id))
                }
            }

            if (option.length) for (const item of option) {
                const title = item.split(' ')[0]
                const description = item.replace(`${title} `, '')

                const optionDB = await Option.findOne({where: {title: title, description: description}})
                const optionDevice = await DeviceOption.findAll({where: {OptionId: optionDB.id}})

                if (optionDevice.length) for (const el of optionDevice) {
                    Options.push(el.DeviceId)
                }
            }

            const returnedDevices = Devices.filter(item => {
                if (Types.length && Brands.length && Options.length) {
                    if (Types.includes(item.id) && Brands.includes(item.id) && Options.includes(item.id)) return item
                } else {
                    if (Types.length && !Brands.length && !Options.length) if (Types.includes(item.id)) return item
                    if (!Types.length && Brands.length && !Options.length) if (Brands.includes(item.id)) return item
                    if (!Types.length && !Brands.length && Options.length) if (Options.includes(item.id)) return item

                    if (!Types.length && Brands.length && Options.length) if (Brands.includes(item.id) && Options.includes(item.id)) return item
                    if (Types.length && !Brands.length && Options.length) if (Types.includes(item.id) && Options.includes(item.id)) return item
                    if (Types.length && Brands.length && !Options.length) if (Types.includes(item.id) && Brands.includes(item.id)) return item
                }
            })

            return returnedDevices.map(item => item.id)
        } catch (err) {
            throw err
        }
    }
    async createDeviceOption (optionId, deviceId) {
        try {
            const isDeviceOption = await DeviceOption.findOne({where: {DeviceId: deviceId, OptionId: optionId}})
            if (isDeviceOption) return isDeviceOption
            const deviceOption = await DeviceOption.create({DeviceId: deviceId, OptionId: optionId})
            return deviceOption
        } catch (err) {
            throw err
        }
    }
    async createOption (title, desc, deviceId) {
        try {
            const isOption = await Option.findOne({where: {title: title, description: desc}})
            if (isOption) {
                const relation = await this.createDeviceOption(isOption.id, deviceId)
                return isOption
            }
            const option = await Option.create({
                title: title,
                description: desc,
                DeviceId: deviceId
            })
            const relation = await this.createDeviceOption(option.id, deviceId)
            return option
        } catch (err) {
            throw err
        }
    }
    async createNewItem (device, options) {
        try {
            const name = device.name
            const price = device.price
            const brand = device.brand.replace(' ', '')
            const type = device.type.replace(' ', '')
            const img = device.img

            const brandId = await this.brandId(brand)
            const typeId = await this.typeId(type)

            const item = await Device.create({
                name: name,
                price: price,
                img: img,
                TypeId: typeId,
                BrandId: brandId,
            })

            const Options = []
            for (let i in options) {
                const el = await this.createOption(i, options[i], item.id)
                Options.push(el)
            }

            return {item, Options}

        } catch (err) {
            throw err
        }
    }
    async getSearched (array) {
        try {
            const device = []
            for (const item of array) {
                const el = item.toString().toLowerCase()
                const isType = await Type.findOne({where: {name: el}})
                const isBrand = await Brand.findOne({where: {name: el}})
                if (!isType && !isBrand) {
                    const name = el[0].toUpperCase() + el.slice(1)
                    device.push(name)
                }
            }

            if (device.length) {
                const arr = device.map(item => {
                    if (item==='Macbook') return 'MacBook'
                    return item
                })
                const Name = arr.join(' ')
                const searchedDevices = await Device.findAll({where: {name: Name}})
                if (searchedDevices.length) return searchedDevices.map(item => item.id)
            }
            const toFilter = array.map(item => item.toString().toLowerCase())
            return await this.getFilltered(toFilter, toFilter, [])
        } catch (err) {
            throw err
        }
    }
}

module.exports = new catalogService()