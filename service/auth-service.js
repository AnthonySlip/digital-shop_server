const {User, Token, Basket, Saved} = require('../model/models')
const apiError = require('../error/api-error')
const {where} = require("sequelize")
const sha512 = require('crypto-js/sha512')
const tokenService = require('./token-service')
const payloadService = require('./payload-service')

class authService {
    async signUp (name, email, password) {
        try {
            const candidate = await User.findAll({where: {email: email}})
            if (candidate.length) throw apiError.BadGateway(`User with ${email} already exist`)
            const hashPassword =  sha512(password).toString()

            const user = await User.create({
                name,
                email,
                password: hashPassword,
            })

            const basket = await Basket.create({UserId: user.id, list: []})
            const saved = await Saved.create({UserId: user.id, list: []})


            const payload = payloadService.create(user)
            const {accessToken, refreshToken} = tokenService.generateTokens(payload)

            const Token = await tokenService.saveToken(refreshToken, user.id)
            if (Token.refreshToken===refreshToken) return {accessToken, refreshToken, user: payload}
        } catch (err) {
            throw err
        }
    }
    async logIn (email, password) {
        try {
            const user = await User.findOne({where: {email: email}})
            if (!user) throw apiError.BadGateway(`No user with ${email} email`)
            const hashPassword = sha512(password).toString()
            if (hashPassword !== user.password) throw apiError.BadRequest('Incorrect email/password')

            const payload = payloadService.create(user)
            const {accessToken, refreshToken} = tokenService.generateTokens(payload)
            await tokenService.saveToken(refreshToken, user.id)
            return {accessToken, refreshToken, user: payload}
        } catch (err) {
            throw err
        }
    }
    async signOut (refreshToken) {
        try {
            const data = await tokenService.removeToken(refreshToken)
            return data
        } catch (err) {
            throw err
        }
    }
    async getToken (refreshToken) {
        if (!refreshToken) throw apiError.Forbidden('Invalid refresh token')
        const isValid = tokenService.validateRefreshToken(refreshToken)
        const isTokenFromDB = await Token.findOne({where: {refreshToken: refreshToken}})
        if (!isValid || !isTokenFromDB) throw apiError.Forbidden('Invalid refresh token')

        const user = await User.findByPk(isTokenFromDB.UserId)
        if (!user) throw apiError.BadRequest('Invalid user id')
        const payload = payloadService.create(user)

        const tokens = tokenService.generateTokens(payload)
        if (!tokens) throw apiError.BadRequest('No tokens')
        await tokenService.saveToken(tokens.refreshToken, user.id)
        return {...tokens}
    }

    async updateData (userId, newName, newEmail, oldPassword, newPassword) {
        const user = await User.findByPk(userId)
        if (!user) throw apiError.BadRequest('Invalid user id')
        const result = []

        if (newName) {
            const updated = await user.update({name: newName})
            const payload = payloadService.create(updated)
            result.push(payload)
        }
        if (newEmail) {
            const updated = await user.update({email: newEmail})
            const payload = payloadService.create(updated)
            result.push(payload)
        }
        if (oldPassword && newPassword){
            const oldPasswordHashFromDB = user.password
            const oldPasswordHashFromReq = sha512(oldPassword).toString()
            const newPasswordHash = sha512(newPassword).toString()

            if (oldPasswordHashFromReq!==oldPasswordHashFromDB) throw apiError.Forbidden('Incorrect old password')

            const updated = await user.update({password: newPasswordHash})
            const payload = payloadService.create(updated)
            result.push(payload)
        }
        return result
        throw apiError.BadRequest(`Invalid new user's data`)
    }
}

module.exports = new authService()