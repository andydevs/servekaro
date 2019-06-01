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
    filepath,
    buildRequestHandler,
    sendFile,
    handleRequest,
    handleError,
    handleNotFound,
    handleNotFoundObject,
    handleNotFoundString,
    handleNotFoundDefault
} from '../lib/request-handler'
import { TestResponse } from './test-http'

// Configure chai
chai.use(chaiHttp)
chai.use(chaiHelper)
chai.use(chaiSinon)

// Test filepath functiosn
describe('filepath', () => {
    var config = { serving: 'exp', root: 'main.html' }
    it('returns a filepath given an http url and config', () => {
        var fp = filepath(config, '/index.html')
        expect(fp).to.equal(path.join('exp', 'index.html'))
    })
    it('returns the root filepath if given root url and config', () => {
        var fp = filepath(config, '/')
        expect(fp).to.equal(path.join('exp', 'main.html'))
    })
})

describe('buildRequestHandler', () => {
    it('returns handler that calls handleRequest')
})

describe('sendFile', () => {
    var config = { serving: 'exp', root: 'main.html' }
    var res

    beforeEach(() => {
        res = new TestResponse()
    })

    it('writes file from url', (done) => {
        res.on('finish', () => {
            expect(res.status).to.equal(200)
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            expect(res.data).to.be.fromFile('exp/index.html')
            done()
        })
        sendFile(config, '/index.html', res)
    })
    it('writes status if status is given', (done) => {
        res.on('finish', () => {
            expect(res.status).to.equal(301)
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            expect(res.data).to.be.fromFile('exp/index.html')
            done()
        })
        sendFile(config, '/index.html', res, 301)
    })
    it('writes root file from config if root url given', (done) => {
        res.on('finish', () => {
            expect(res.status).to.equal(200)
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            expect(res.data).to.be.fromFile('exp/main.html')
            done()
        })
        sendFile(config, '/', res)
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
    })
    it('sets content-type to text/plain', (done) => {
        res.on('finish', () => {
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            done()
        })
    })
    it('writes server error text to response', (done) => {
        res.on('finish', () => {
            expect(res.data).to.equal('Internal server error!')
            done()
        })
    })
})

describe('handleNotFound', () => {
    it('calls handleNotFoundObject if notFound in config is object')
    it('calls handleNotFoundString if notFound in config is string')
    it('calls handleNotFoundDefault if notFound in config is not given')
})

describe('handleNotFoundObject', () => {
    it('sets status to status of object')
    it('sets content type to type of filename')
    it('writes text from filename of object to response')
})

describe('handleNotFoundString', () => {
    it('sets status to 404')
    it('sets content type to type of filename')
    it('writes text from given file name to response')
})

describe('handleNotFoundDefault', () => {
    it('sets status to 404')
    it('sets content type to text/plain')
    it('writes not found text to response')
})
