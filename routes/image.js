const express = require('express')
const router = express.Router()
const http = require('http')
const fs = require('fs')
const jwt = require('jsonwebtoken')
const download = require('image-downloader')

router.get('/', function(req, res, next) {
    let token = req.cookies.access_token
    let secretKey = config.key
    jwt.verify(token, secretKey, function(err, decoded) {
        if (err) {
            logger.debug('Session Logged out')
            res.status(401).redirect('/')
        } else {
            var render_url = req.query.url
            logger.silly('Image URL', render_url)
            let options = {
                url: render_url,
                dest: './public/images/google.png'
            }
            /**
             * Will be used in order to store the image at a particular location and after saving will render the image.
             * @param {object} options - have 2 parameters url of the image and destination to be stored at
                  {string}    url- url of the image
                  {string}    dest-  destination where the image is to be stored
            */
            download.image(options)
                .then(({ filename, image }) => {
                    logger.info('image saved to', filename)
                    logger.info('GET /image')
                    res.render('image')
                }).catch((err) => {
                    logger.error(err)
                    logger.warn('Redirecting to welcome page')
                    res.status(404).redirect('welcome')
                })
        }
    })
})

module.exports = router