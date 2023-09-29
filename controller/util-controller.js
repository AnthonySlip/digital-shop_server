const apiError = require('../error/api-error')
class utilController {
    async getCity (req, res, next) {
        try {
            const latitude = req.params.latitude
            const longitude = req.params.longitude
            const apiKey = process.env.GEOCODING_API
            const response = await fetch(`http://api.positionstack.com/v1/reverse?access_key=${apiKey}&query=${latitude},${longitude}`)
            const data = await response.json()
            return res.json(data.data[0].county)
        } catch (err) {
            next(err)
        }
    }
    async getMainData (req, res, next) {
        try {
            const data = {
                description: `Welcome to DigitalShop - your source of high-quality electronics and equipment! We strive to provide you with the latest and most reliable devices to make your life easier and meet all your needs.`,
                advantages: [
                    `Wide range: Here you will find everything from smartphones and tablets to laptops, TVs, and much more. We offer products of various brands and price categories.`,
                    `Quality Guaranteed: We carefully select the products for our store to ensure their reliability and performance. All products are supplied from official dealers and manufacturers.`,
                    `Convenient ordering: Our website is designed with your comfort in mind. You can easily find the products you need, read detailed descriptions and reviews, and place an order in just a few clicks.`,
                    `Fast delivery: We value your time. That's why we offer fast and reliable delivery to your home or office.`,
                    `Professional support: Our team is ready to answer your questions and help you choose the right device. We are always available via chat, email and phone.`,
                ],
                article: `Buy with confidence from DigitalShop! We do our best to make your online shopping experience enjoyable and satisfying. We hope you will find everything you need for your digital life.`
            }
            return res.json(data)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = new utilController()