const tokenService = require('../service/token-service')
const apiError = require('../error/api-error')

module.exports = function (req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader) return next(apiError.Unauthorized('No credential request'))

        const accessToken = authHeader.split(' ')[1]
        if (!accessToken) return next(apiError.Unauthorized('Empty access token'))

        const isValidAccessToken = tokenService.validateAccessToken(accessToken)
        if (!isValidAccessToken) return next(apiError.Unauthorized('Invalid access token'))

        req.user = isValidAccessToken

        next()
    } catch (err) {
        return next(err)
    }
}