const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

router.get('/', function(req, res, next) {
    res.render('index', { title: 'index' })
})

router.post('/', function(req, res, next) {
    var user_name = req.body.name
    var pwd = req.body.password
    var superSecret = config.key
    /**
     * Genrates the required token.
     * @param {object}  - has th epublic values which we want to use later.
     * @param {string} secretKey - Secret key is used in order to encrypt the values.
     * @param {object} - has the value expiresIn (tell the time in which the token will be expired)
     */
    if (user_name === 'admin' && pwd === 'admin') {
        var token = jwt.sign({ user_name: user_name }, superSecret, {
            expiresIn: 60 * 5
        })
        logger.info('Token Generated')
        res.cookie('access_token', token, { httpOnly: true }).redirect('welcome')
    }
})
module.exports = router