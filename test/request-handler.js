/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import chai, { expect } from 'chai'
import sinon from 'sinon'
import chaiHttp from 'chai-http'
import chaiSinon from 'sinon-chai'
import chaiHelper from './chai-helper'
import path from 'path'
import fs from 'fs'
import {
    buildRequestHandler,
    handleRequestWithNotFoundHandler,
    handleError
} from '../lib/request-handler'
import { TestRequest, TestResponse } from './test-http'

// Configure chai
chai.use(chaiHttp)
chai.use(chaiSinon)
chai.use(chaiHelper)

describe('buildRequestHandler', () => {
    it('returns handler that calls handleRequest')
})

describe('handleRequestWithNotFoundHandler', () => {
    var config = { serving: 'exp', root: 'main.html' }
    var handleNotFound
    var req, res

    beforeEach(() => {
        handleNotFound = sinon.stub().callsFake((config, response) => {
            response.end()
        })
        res = new TestResponse()
    })

    it('sends file at request.url if file exists', (done) => {
        req = new TestRequest('/index.html')
        res.on('finish', () => {
            expect(res.status).to.equal(200)
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            expect(res.data).to.be.fromFile('exp/index.html')
            expect(handleNotFound).to.not.have.been.called
            done()
        })
        handleRequestWithNotFoundHandler(config, req, res, handleNotFound)
    })
    it('sends root file if root url given', (done) => {
        req = new TestRequest('/')
        res.on('finish', () => {
            expect(res.status).to.equal(200)
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            expect(res.data).to.be.fromFile('exp/main.html')
            expect(handleNotFound).to.not.have.been.called
            done()
        })
        handleRequestWithNotFoundHandler(config, req, res, handleNotFound)
    })
    it('calls handleNotFound if file not found', (done) => {
        req = new TestRequest('/foo.bar')
        res.on('finish', () => {
            expect(handleNotFound).to.have.been.calledWith(config, res)
            done()
        })
        handleRequestWithNotFoundHandler(config, req, res, handleNotFound)
    })
    it('sends error if there was an error', (done) => {
        req = new TestRequest(undefined)
        res.on('finish', () => {
            expect(res.status).to.equal(500)
            expect(res.headers).to.have.property('Content-Type').that.equals('text/plain')
            expect(res.data).to.equal('Internal server error!')
            done()
        })
        handleRequestWithNotFoundHandler(config, req, res, handleNotFound)
    })
})

describe('handleError', () => {
    var res

    beforeEach(() => {
        res = new TestResponse()
    })

    it('sets status to 500', (done) => {
        res.on('finish', () => {
            expect(res.status).to.equal(500)
            done()
        })
        handleError(res)
    })
    it('sets content-type to text/plain', (done) => {
        res.on('finish', () => {
            expect(res.headers).to.have.property('Content-Type').that.equals('text/plain')
            done()
        })
        handleError(res)
    })
    it('writes server error text to response', (done) => {
        res.on('finish', () => {
            expect(res.data).to.equal('Internal server error!')
            done()
        })
        handleError(res)
    })
})
