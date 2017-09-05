var config = {}

config.port = process.env.OPENSHIFT_NODEJS_PORT || 8001
config.server_address = '127.0.0.1'
config.key = 'A23KJASDK'
config.logDir = 'log'

module.exports = config
