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
import {
    buildRequestHandler,
    handleError,
} from '../lib/request-handler'
import { TestResponse } from './test-http'

// Configure chai
chai.use(chaiHttp)
chai.use(chaiHelper)

describe('buildRequestHandler', () => {
    it('returns handler that calls handleRequest')
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
