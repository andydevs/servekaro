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
import path from 'path'
import fs from 'fs'
import { filepath } from '../lib/request-handler'


// Configure chai
chai.use(chaiHttp)
chai.use(chaiHelper)


// Test filepath functiosn
describe('filepath', () => {
    var config = { serving: 'exp', root: '/main.html' }

    it('returns a filepath given an http url and config', () => {
        var fp = filepath(config, '/index.html')
        expect(fp).to.equal(path.join('exp', 'index.html'))
    })

    it('returns the root filepath if given root url and config', () => {
        var fp = filepath(config, '/')
        expect(fp).to.equal(path.join('exp', 'main.html'))
    })
})
