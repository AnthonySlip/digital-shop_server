const pg = require('pg')
const {Sequelize} = require('sequelize')


// module.exports = new Sequelize(
//     'verceldb',//process.env.DB_NAME,
//     process.env.POSTGRES_USER,
//     process.env.POSTGRES_PASSWORD,
//     {
//         dialect: 'postgres',
//         host: process.env.POSTGRES_HOST,
//         port: process.env.DB_PORT
//     }
// )
module.exports = new Sequelize(process.env.POSTGRES_URL_NON_POOLING+'?ssl=true', {
    dialectModule: pg
})


