process.env.NODE_ENV = 'test'

const welcome = require('../routes/welcome')

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../app')
const should = chai.should()
const request = require('supertest')
chai.use(chaiHttp)
var Cookies

describe('/POST index', () => {
    it('Logging into current session', (done) => {
        request(app)
            .post('/')
            .set('Accept', 'application/json')
            .send({ 'name': 'admin', 'password': 'admin' })
            .expect(200)
            .end(function(err, res) {
                // Save the cookie to use it later to retrieve the session
                Cookies = res.headers['set-cookie'].pop().split(';')[0]
                done()
            })
    })
})

describe('/POST welcome', () => {
    it('This should return the json patcher object', (done) => {
        let original = {
            'baz': 'qux',
            'foo': 'bar'
        }
        let patch = [
            { 'op': 'replace', 'path': '/baz', 'value': 'boo' },
            { 'op': 'add', 'path': '/hello', 'value': 'world' },
            { 'op': 'remove', 'path': '/foo' }
        ]
        var req = request(app).post('/welcome')
        req.cookies = Cookies
        req
            .send({ 'original': original, 'patch': patch })
            .expect('Content-Type', /json/)
            .expect(200)
            .end(function(err, res) {
                res.body.data.should.have.a('object')
                res.body.data.should.have.property('baz').eql('boo')
                res.body.data.should.have.property('hello').eql('world')
                done()
            })
    })
})

describe('/GET image', () => {
    it('this should have a proper image', (done) => {
        var req = request(app).get('/image')
        req.cookies = Cookies
        req
            .query({ url: 'http://i.dailymail.co.uk/i/pix/2017/01/16/20/332EE38400000578-4125738-image-a-132_1484600112489.jpg' })
            .expect(200)
            .end(function(err, res) {
                done()
            })
    })
})

describe('/GET image', () => {
    it('this test case does not have a proper image url and should return 404', (done) => {
        var req = request(app).get('/image')
        req.cookies = Cookies
        req
            .query({ url: 'http://i.dailymail.co.uk/i/pix/2017/01/16/20/332EE38400000578-412' })
            .expect(404)
            .end(function(err, res) {
                done()
            })
    })
})