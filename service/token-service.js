const jwt = require('jsonwebtoken')
const { Token } = require('../model/models')
const apiError = require('../error/api-error')
class tokenService {
    generateTokens (payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn: '30m'})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn: '60d'})
        return {accessToken, refreshToken}
    }
    async saveToken(refreshToken, userId) {
        try {
            const isToken = await Token.findOne({where: {UserId: userId}})
            if (isToken) {
                isToken.refreshToken = refreshToken
                await isToken.save()
                return isToken
            }

            const token = await Token.create({refreshToken, UserId: userId})
            return token
        } catch (err) {
            throw err
        }
    }
    async removeToken(refreshToken){
        try {
            const isToken = await Token.destroy({where: {refreshToken: refreshToken}})
            return isToken
        } catch (err) {
            throw err
        }
    }
    validateAccessToken(token) {
        try {
            const isValid = jwt.verify(token, process.env.JWT_ACCESS_KEY)
            return isValid
        } catch (err) {
            return null
        }
    }
    validateRefreshToken(token) {
        try {
            const isValid = jwt.verify(token, process.env.JWT_REFRESH_KEY)
            return isValid
        } catch (err) {
            return null
        }
    }
    decodeAccessToken (token) {
        try {
            const decoded = jwt.decode(token, process.env.JWT_ACCESS_KEY)
            return decoded
        } catch (err) {
            return null
        }
    }
    async findToken(token) {
        try {
            const isToken = await Token.findOne({where: {refreshToken: token}})
            if (!isToken) throw apiError.BadRequest('Invalid refresh token')
            return isToken.refreshToken
        } catch (err) {
            throw err
        }
    }
}

module.exports = new tokenService()