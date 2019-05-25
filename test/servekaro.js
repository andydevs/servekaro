/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import chaiHelper from './chai-helper'
import ServeKaro from '../lib/servekaro'
import path from 'path'
import fs from 'fs'

// Configure chai
chai.use(chaiHttp)
chai.use(chaiHelper)

describe('ServeKaro.constructor', () => {
    context('when given no arguments', () => {
        it('sets port, host, serving, and notFound properties to default values', () => {
            var server = new ServeKaro()
            expect(server.port).to.equal(80)
            expect(server.host).to.equal('0.0.0.0')
            expect(server.serving).to.equal('public')
            expect(server.root).to.equal('index.html')
            expect(server.notFound).to.be.null
        })
    })

    context('when given properties object', () => {
        it('sets port, host, serving, and notFound properties to given values in properties', () => {
            var server = new ServeKaro({
                port: 8080,
                host: '196.168.1.23',
                serving: 'exp',
                root: 'home.html',
                notFound: '404.html',
                bogus: 'phony'
            })
            expect(server.port).to.equal(8080)
            expect(server.host).to.equal('196.168.1.23')
            expect(server.serving).to.equal('exp')
            expect(server.root).to.equal('home.html')
            expect(server.notFound).to.equal('404.html')
            expect(server.bogus).to.not.exist
        })
    })
})


describe('ServeKaro.configure', () => {
    it('configures port, host, root, serving, and notFound', () => {
        var server = new ServeKaro()
        server.configure({
            port: 8080,
            host: 'localhost',
            root: 'main.html',
            serving: 'exp',
            notFound: '404.html',
            bogus: 'phony' })
        expect(server.port).to.equal(8080)
        expect(server.host).to.equal('localhost')
        expect(server.serving).to.equal('exp')
        expect(server.root).to.equal('main.html')
        expect(server.notFound).to.equal('404.html')
        expect(server.bogus).to.not.exist
    })
})

describe('ServeKaro._filepath', () => {
    // Test ._filepath method
    it('returns a filepath given an http url', () => {
        var server = new ServeKaro()
        var filepath = server._filepath('/index.html')
        expect(filepath).to.equal(path.join('exp', 'index.html'))
    })
})


describe('ServeKaro.serve', () => {
    // Server handle
    var server

    // Instantiate server on each run
    beforeEach(done => {
        server = new ServeKaro({
            port: 8080,
            host: 'localhost',
            serving: 'exp'
        })
        server.serve(done)
    })

    // Close server on each run
    afterEach(() => {
        if (server.listening) {
            server.close()
        }
    })

    // Test address info on .serve
    it('serves on the configured port and host when .serve is called', () => {
        expect(server.address().port).to.equal(server.port)
        expect(server.address().address).to.be.sameIp(server.host)
    })

    // Test serving files
    it('serves files from the configured directory', done => {
        chai.request(server)
            .get('/example.css')
            .end((error, response) => {
                expect(error).to.not.exist
                expect(response).to.have.status(200)
                expect(response).to.have.header('Content-Type', 'text/css')
                expect(response.text).to.be.fromFile('exp/example.css')
                done()
            })
    })

    // Test serving root file
    it('serves the root file when accessing root', done => {
        chai.request(server)
            .get('/')
            .end((error, response) => {
                expect(error).to.not.exist
                expect(response).to.have.status(200)
                expect(response).to.have.header('Content-Type', 'text/html')
                expect(response.text).to.be.fromFile('exp/main.html')
                done()
            })
    })

    // Test 404 serve
    context('when given url is not found', () => {
        // Test null 404
        it('serves default not found message with status 404 if notFound is null', done => {
            server.notFound = null
            chai.request(server)
                .get('/notexistant.lmth')
                .end((error, response) => {
                    expect(error).to.not.exist
                    expect(response).to.have.status(404)
                    expect(response).to.have.header('Content-Type', 'text/plain')
                    expect(response.text).to.equal('File not found!')
                    done()
                })
        })

        // Test filename 404
        it('serves the given notFound file with status 404 if notFound is a string filename', done => {
            server.notFound = '404.html'
            chai.request(server)
                .get('/totallynotreal.lmao')
                .end((error, response) => {
                    expect(error).to.not.exist
                    expect(response).to.have.status(404)
                    expect(response).to.have.header('Content-Type', 'text/html')
                    expect(response.text).to.be.fromFile('exp/404.html')
                    done()
                })
        })

        // Test object 404
        it('serves the notFound file with notFound status if notFound is object with filename and status', done => {
            server.notFound = { status: 200, file: 'index.html' }
            chai.request(server)
                .get('/icantbelieveitsnot.butter')
                .end((error, response) => {
                    expect(error).to.not.exist
                    expect(response).to.have.status(200)
                    expect(response).to.have.header('Content-Type', 'text/html')
                    expect(response.text).to.be.fromFile('exp/index.html')
                    done()
                })
        })
    })
})
