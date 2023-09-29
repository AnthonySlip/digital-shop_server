const authService = require('../service/auth-service')
const apiError = require('../error/api-error')
const db = require('../db')
class authController {
    async signUp (req, res, next) {
        try {
            const {name, email, password} = req.body
            if (!name || !email || !password) throw apiError.BadRequest('Invalid user data')
            const result = await authService.signUp(name, email, password)
            res.cookie('refreshToken', result?.refreshToken, {maxAge: 60*24*60*60*1000, httpOnly: true})
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async logIn (req, res, next) {
        try {
            const {email, password} = req.body
            if (!email || !password) throw apiError.BadRequest('Invalid user data')
            const result = await authService.logIn(email, password)
            res.cookie('refreshToken', result?.refreshToken, {maxAge: 60*24*60*60*1000, httpOnly: true})
            return res.json(result)
        } catch (err) {
            next(err)
        }
    }
    async signOut (req, res, next) {
        try {
            const refreshToken = req.headers.cookie.replace('refreshToken=', '')

            const isOut = await authService.signOut(refreshToken)
            return res.json(isOut)
        } catch (err) {
            next(err)
        }
    }
    async getUserData (req, res, next) {
        try {
            const userId = req.param('id')
            if (!userId) throw apiError.BadRequest('Invalid user id')
            const userData = await authService.getUserData(userId)
            return res.json(userData)
        } catch (err) {
            next(err)
        }
    }
    async getToken (req, res, next) {
        try {
            const {refreshToken} = req.cookies
            const tokens = await authService.getToken(refreshToken)
            res.cookie('refreshToken', tokens.refreshToken, {maxAge: 60*24*60*60*1000, httpOnly: true})
            return res.json(tokens)
        } catch (err) {
            next(err)
        }
    }
    async updateData (req, res, next) {
        try {
            const userId = req.param('id')
            const {newName, newEmail, oldPassword, newPassword} = req.body
            if (!newName && !newEmail && !oldPassword && !newPassword) throw apiError.BadRequest(`Invalid new user's data`)
            const isUpdated = await authService.updateData(userId, newName, newEmail, oldPassword, newPassword)
            return res.json(isUpdated)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new authController()