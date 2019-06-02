/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import chai, { expect } from 'chai'
import path from 'path'
import fs from 'fs'
import makeConfig from '../lib/make-config'


describe('makeConfig', () => {
    it('returns default config if file is not found', () => {
        var config = makeConfig('bogus.json')
        expect(config.host).to.have.property('env').that.equals('HOST')
        expect(config.host).to.have.property('default').that.equals('0.0.0.0')
        expect(config.port).to.have.property('env').that.equals('PORT')
        expect(config.port).to.have.property('default').that.equals(80)
        expect(config.serving).to.equal('public')
        expect(config.root).to.equal('index.html')
    })
    it('returns config file from json if file is found', () => {
        var config = makeConfig('servekaro.json')
        expect(config.host).to.equal('localhost')
        expect(config.port).to.equal(8080)
        expect(config.serving).to.equal('exp')
        expect(config.notFound).to.equal('404.html')
    })
    it('returns config with values not set set to defaults', () => {
        var config = makeConfig('testkaro.json')
        expect(config.host).to.have.property('env').that.equals('HOST')
        expect(config.host).to.have.property('default').that.equals('0.0.0.0')
        expect(config.port).to.have.property('env').that.equals('PORT')
        expect(config.port).to.have.property('default').that.equals(80)
        expect(config.serving).to.equal('exp')
        expect(config.root).to.equal('main.html')
    })
})
