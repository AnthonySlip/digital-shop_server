require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const router = require('./router/router')
const sequelize = require('./db')
const models = require('./model/models')
const errorHandler = require('./middleware/error-middleware')


const app = express()
const PORT = process.env.PORT || 6090

app.use(express.json())
app.use(cookieParser())
app.use(cors({
    credentials: true,
    origin: process.env.CLIENT
}))

app.use('/api', router)


app.use(errorHandler)
const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        app.listen(PORT, () => console.log(`Server has started on ${PORT} port`))
    } catch (err) {
        console.log(err)
    }
}

start()
