const sequelize = require('../db')
const { DataTypes } = require('sequelize')

const User = sequelize.define('User', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, unique: true, allowNull:false},
    name: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    role: {type: DataTypes.STRING, defaultValue: 'User'}
})

const Token = sequelize.define('Token', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true, unique: true},
    refreshToken: {type: DataTypes.TEXT, unique: true, allowNull: false},
})

const Basket = sequelize.define('Basket', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, unique: true},
    list: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true}
})

const Saved = sequelize.define('Saved', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, unique: true},
    list: {type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true}
})

const Device = sequelize.define('Device', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, unique: true, allowNull:false},
    name: {type: DataTypes.STRING, allowNull: false},
    price: {type: DataTypes.INTEGER, allowNull: false},
    img: {type: DataTypes.STRING, allowNull: false},
})

const Type = sequelize.define('Type', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, unique: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Brand = sequelize.define('Brand', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, unique: true},
    name: {type: DataTypes.STRING, unique: true, allowNull: false},
})

const Option = sequelize.define('Option', {
    id: {type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, unique: true},
    title: {type: DataTypes.STRING, allowNull: false},
    description: {type: DataTypes.STRING, allowNull: false},
})

const DeviceOption = sequelize.define('DeviceOption', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const BasketDevice = sequelize.define('BasketDevice', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const SavedDevice = sequelize.define('SavedDevice', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

const TypeBrand = sequelize.define('TypeBrand', {
    id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
})

User.hasOne(Basket)
Basket.belongsTo(User)

User.hasOne(Saved)
Saved.belongsTo(User)

User.hasOne(Token)
Token.belongsTo(User)

Type.hasMany(Device)
Device.belongsTo(Type)

Brand.hasMany(Device)
Device.belongsTo(Brand)

Device.belongsToMany(Option, {through: DeviceOption})
Option.belongsToMany(Device, {through: DeviceOption})

Basket.belongsToMany(Device,{through: BasketDevice})
Device.belongsToMany(Basket,{through: BasketDevice})

Saved.belongsToMany(Device,{through: SavedDevice})
Device.belongsToMany(Saved,{through: SavedDevice})

Type.belongsToMany(Brand, {through: TypeBrand})
Brand.belongsToMany(Type, {through: TypeBrand})

module.exports = {
    User,
    Token,
    Basket,
    Saved,
    Device,
    Type,
    Brand,
    Option,
    DeviceOption,
    BasketDevice,
    SavedDevice,
    TypeBrand
}