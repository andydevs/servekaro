/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import http from 'http'
import chai, { expect } from 'chai'
import chaiHttp from 'chai-http'
import chaiHelper from './chai-helper'
import path from 'path'
import fs from 'fs'
import servekaro, { resolve, servebanado } from '../lib/servekaro-new'
require('dotenv').config()

// Configure chai
chai.use(chaiHttp)
chai.use(chaiHelper)

// Config file
var config = {
    host: 'localhost',
    port: 8080,
    serving: 'exp',
    root: 'main.html',
    notFound: '404.html'
}


describe('servebanado', () => {
    it('creates an http server', () => {
        var server = servebanado(config)
        expect(server).to.be.an.instanceof(http.Server)
    })
})


describe('servekaro', () => {
    it('serves http server on configured host and port', (done) => {
        var server = servekaro(config, () => {
            expect(server.address().port).to.equal(config.port)
            expect(server.address().address).to.be.sameIp(config.host)
            server.close(done)
        })
    })
})


describe('resolve', () => {
    it('resolves environment variable if given environment config', () => {
        expect(resolve({ env: 'TEST', default: 'goodbye' })).to.equal('hello')
    })
    it('resolves string if given string', () => {
        expect(resolve('howdy')).to.equal('howdy')
    })
})
