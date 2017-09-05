require('use-strict')

const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const favicon = require('serve-favicon')
const winston = require('winston')
const cookieParser = require('cookie-parser')
const fs = require('fs')
const path = require('path')
global.config = require('./config') // CONFIGURATION FILE
var app = express()

// SETTING THE PARAMETERS THROUGHOUT THE APPLICATION
app.locals.appTitle = 'TestApp'
app.locals.env = 'development'

// middleware
app.use(express.static(path.join(__dirname, '/public')))

// view engine setup
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'jade')

app.use(favicon((path.join(__dirname, '/public/favicon.ico'))))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(cookieParser())

app.use('development', function () {
  app.use(express.errorHandler())
})

// setting up the routes
const index = require('./routes/index')
const welcome = require('./routes/welcome')
const image = require('./routes/image')
app.use('/', index)
app.use('/welcome', welcome)
app.use('/image', image)

// setting up the logger
winston.setLevels(winston.config.npm.levels)
winston.addColors(winston.config.npm.colors)
const logDir = config.logDir
if (!fs.existsSync(logDir)) {
    // Create the directory if it does not exist
  fs.mkdirSync(logDir)
}
logger = new (winston.Logger)({
  transports: [
    new winston.transports.Console({
      colorize: true
    }),
    new winston.transports.File({
      level: app.get('env') === 'development' ? 'debug' : 'info',
      filename: logDir + '/logs.log',
      maxsize: 1024 * 1024 * 10 // 10MB
    })
  ],
  exceptionHandlers: [
    new winston.transports.File({
      filename: 'log/exceptions.log'
    })
  ]
})

// catch 404 and forwarding to error handler
app.use(function (req, res, next) {
  var err = new Error('NOT FOUND')
  err.status = 404
  logger.error('Route not defined')
  logger.error(req.url)
    // next(err);
  return res.redirect('/') // redirects to home page in case of a 404
})

// server starts here
const server = http.createServer(app)
server.listen(config.port, config.server_address, function () {
  logger.info('server is started at ', config.server_address, 'at', config.port)
})

// printing stack trace in case of error in development
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// printing stack trace in case of production
// no stack trace is revealed to the user

app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app
