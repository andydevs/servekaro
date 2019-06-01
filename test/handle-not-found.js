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
import chaiHelper from './chai-helper'
import path from 'path'
import fs from 'fs'
import getHandleNotFoundForConfig, {
    handleNotFoundObject,
    handleNotFoundString,
    handleNotFoundDefault
} from '../lib/handle-not-found'
import { TestResponse } from './test-http'

describe('getHandleNotFoundForConfig', () => {
    var configDef = { }
    var configStr = { notFound: '404.html' }
    var configObj = { notFound: { status: 200, file: 'index.html' } }
    it('returns handleNotFoundObject if notFound is object', () => {
        expect(getHandleNotFoundForConfig(configObj)).to.equal(handleNotFoundObject)
    })
    it('returns handleNotFoundString if notFound is string', () => {
        expect(getHandleNotFoundForConfig(configStr)).to.equal(handleNotFoundString)
    })
    it('returns handleNotFoundDefault if notFound doesn\'t exist', () => {
        expect(getHandleNotFoundForConfig(configDef)).to.equal(handleNotFoundDefault)
    })
})

describe('handleNotFoundObject', () => {
    var config = {
        serving: 'exp',
        notFound: {
            status: 200,
            file: 'index.html'
        }
    }
    var res

    beforeEach(() => {
        res = new TestResponse()
    })

    it('sets status to status of object', (done) => {
        res.on('finish', () => {
            expect(res.status).to.equal(200)
            done()
        })
        handleNotFoundObject(config, res)
    })
    it('sets content type to type of filename', (done) => {
        res.on('finish', () => {
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            done()
        })
        handleNotFoundObject(config, res)
    })
    it('writes text from filename of object to response', (done) => {
        res.on('finish', () => {
            expect(res.data).to.be.fromFile('exp/index.html')
            done()
        })
        handleNotFoundObject(config, res)
    })
})

describe('handleNotFoundString', () => {
    var config = { serving: 'exp', notFound: '404.html' }
    var res

    beforeEach(() => {
        res = new TestResponse()
    })

    it('sets status to 404', (done) => {
        res.on('finish', () => {
            expect(res.status).to.equal(404)
            done()
        })
        handleNotFoundString(config, res)
    })
    it('sets content type to type of filename', (done) => {
        res.on('finish', () => {
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            done()
        })
        handleNotFoundString(config, res)
    })
    it('writes text from given file name to response', (done) => {
        res.on('finish', () => {
            expect(res.data).to.be.fromFile('exp/404.html')
            done()
        })
        handleNotFoundString(config, res)
    })
})

describe('handleNotFoundDefault', () => {
    var res

    beforeEach(() => {
        res = new TestResponse()
    })

    it('sets status to 404', (done) => {
        res.on('finish', () => {
            expect(res.status).to.equal(404)
            done()
        })
        handleNotFoundDefault(res)
    })
    it('sets content type to text/plain', (done) => {
        res.on('finish', () => {
            expect(res.headers).to.have.property('Content-Type').that.equals('text/plain')
            done()
        })
        handleNotFoundDefault(res)
    })
    it('writes not found text to response', (done) => {
        res.on('finish', () => {
            expect(res.data).to.equal('File not found!')
            done()
        })
        handleNotFoundDefault(res)
    })
})
