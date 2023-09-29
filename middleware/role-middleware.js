const jwt = require('jsonwebtoken')
const apiError = require('../error/api-error')
const tokenService = require("../service/token-service")

module.exports = function (req, res, next) {
    try {

        const authHeader= req.headers.authorization
        if (!authHeader) return next(apiError.Unauthorized('No credential request'))

        const accessToken = authHeader.split(' ')[1]
        if (!accessToken) return next(apiError.Unauthorized('Empty access token'))

        const isValidAccessToken = tokenService.validateAccessToken(accessToken)
        if (!isValidAccessToken) return next(apiError.Unauthorized('Invalid access token'))

        const payload = jwt.decode(accessToken, process.env.JWT_ACCESS_KEY)

        if (payload.role!=="Admin") return next(apiError.Forbidden(`You can't add new items`))

        req.user = isValidAccessToken

        next()

    } catch (err) {
        return next(err)
    }
}

