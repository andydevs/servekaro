/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */

describe('Serve Karo Server', () => {

    it('contains port, host, static, and notfound properties', () => {

    })

    it('can be configured using .json file', () => {

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
