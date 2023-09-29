const sha512 = require('crypto-js/sha512')
class payloadService {
    create (User) {
        const { id, role, name, email } = User
        const payload = {
            id: id,
            name: name,
            email: email,
            role: role,
        }
        return payload
    }
}
 module.exports = new payloadService()