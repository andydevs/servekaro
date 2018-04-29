/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import { expect } from 'chai'
import ServeKaro from '../src/servekaro'

describe('Serve Karo Server', () => {
    // Server handle
    var server

    // Instantiate server
    before(() => {
        server = new ServeKaro()
    })

    it('contains port, host, static, and notfound properties set to default values', () => {
        expect(server.port).to.equal(80)
        expect(server.host).to.equal('0.0.0.0')
        expect(server.static).to.equal('public')
        expect(server.notFound).to.be.null
    })

    it('can be configured using an object', () => {
        server.configure({
            port: 8080,
            host: 'localhost',
            static: 'exp' })
        expect(server.port).to.equal(8080)
        expect(server.host).to.equal('localhost')
        expect(server.static).to.equal('exp')
        expect(server.notFound).to.be.null
    })

    context('when started', () => {
        it('serves files from the configured directory', (done) => {
            done()
        })
    })

    context('when not given notFound information', () => {

        // Configure 404 file
        before(() => {

        })

        it('has notfound property set to null', () => {

        })

        context('when started', () => {

            it('serves default not found message with status 404 if given url is not found', (done) => {

                done()

            })

        })

    })

    context('when given notFound filename', () => {

        // Configure 404 file
        before(() => {

        })

        it('has notfound property set to filename', () => {

        })

        context('when started', () => {

            it('serves the notFound file with status 404 if given url is not found', (done) => {

                done()

            })

        })

    })

    context('when given notFound object with filename and status', () => {

        // Configure 404 file
        before(() => {

        })

        it('has notfound property set to filename', () => {

        })

        context('when started', () => {

            it('serves the notFound file with notFound status if given url is not found', (done) => {

                done()

            })

        })

    })
})
