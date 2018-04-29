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
import ServeKaro from '../src/servekaro'
import path from 'path'
import fs from 'fs'

// Configure chai
chai.use(chaiHttp)

describe('Serve Karo Server', () => {
    // Server handle
    var server

    // Instantiate server
    before(() => {
        server = new ServeKaro()
    })

    // Test default properties
    it('contains port, host, static, and notfound properties set to default values', () => {
        expect(server.port).to.equal(80)
        expect(server.host).to.equal('0.0.0.0')
        expect(server.static).to.equal('public')
        expect(server.notFound).to.be.null
    })

    // Test .configure method
    it('can be configured using an object', () => {
        server.configure({
            port: 8080,
            host: '127.0.0.1',
            static: 'exp' })
        expect(server.port).to.equal(8080)
        expect(server.host).to.equal('127.0.0.1')
        expect(server.static).to.equal('exp')
        expect(server.notFound).to.be.null
    })

    // Test ._filepath method
    it('returns a filepath given an http url', () => {
        expect(server._filepath('/index.html')).to.equal(path.join('exp', 'index.html'))
    })

    // Test address info
    it('serves on the configured port and host', (done) => {
        server.serve(() => {
            expect(server.address().port).to.equal(server.port)
            expect(server.address().address).to.equal(server.host)
            server.close(done)
        })
    })

    // Test serving files
    it('serves files from the configured directory', (done) => {
        server.serve(() => {
            chai.request(server)
                .get('/index.html')
                .end((err, result) => {
                    expect(err).to.not.exist
                    expect(result).to.have.status(200)
                    expect(result.text).to.equal(fs.readFileSync('exp/index.html', {encoding: 'utf-8'}))
                    done()
                })
        })
    })

    context('when not given notFound information', () => {
        // Configure 404 file
        before(() => {})

        // Check property
        it('has notfound property set to null', () => {})

        // Test 404 serve
        it('serves default not found message with status 404 if given url is not found', (done) => {
            done()
        })
    })

    context('when given notFound filename', () => {
        // Configure 404 file
        before(() => {})

        // Check property
        it('has notfound property set to filename', () => {})

        // Test 404
        it('serves the notFound file with status 404 if given url is not found', (done) => {
            done()
        })
    })

    context('when given notFound object with filename and status', () => {
        // Configure 404 file
        before(() => {})

        // Check property
        it('has notfound property set to filename', () => {})

        // Test serve 404
        it('serves the notFound file with notFound status if given url is not found', (done) => {
            done()
        })
    })
})
