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
import { filepath, sendFile } from '../lib/files'
import { TestResponse } from './test-http'

// Configure chai
chai.use(chaiHttp)
chai.use(chaiHelper)

// Test filepath function
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

// Test send file function
describe('sendFile', () => {
    var config = { serving: 'exp', root: 'main.html' }
    var res

    beforeEach(() => {
        res = new TestResponse()
    })

    it('writes file from url', (done) => {
        res.on('finish', () => {
            expect(res.data).to.be.fromFile('exp/index.html')
            done()
        })
        sendFile(config, '/index.html', res)
    })
    it('writes root file from config if root url given', (done) => {
        res.on('finish', () => {
            expect(res.data).to.be.fromFile('exp/main.html')
            done()
        })
        sendFile(config, '/', res)
    })
    it('sets content type to type of file being sent', (done) => {
        res.on('finish', () => {
            expect(res.headers).to.have.property('Content-Type').that.equals('text/html')
            done()
        })
        sendFile(config, '/index.html', res)
    })
    it('sets status to 200 if status is not given', (done) => {
        res.on('finish', () => {
            expect(res.status).to.equal(200)
            done()
        })
        sendFile(config, '/index.html', res)
    })
    it('sets status to status if status is given', (done) => {
        var status = 301
        res.on('finish', () => {
            expect(res.status).to.equal(status)
            done()
        })
        sendFile(config, '/index.html', res, status)
    })
})
