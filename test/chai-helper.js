/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import fs from 'fs'

/**
 * Helper assertions for servekaro testing
 *
 * @param chai the chai instance
 * @param utils the utils instance
 */
export default function(chai, utils) {
    /**
     * Checks if text is from file
     */
    chai.Assertion.addMethod('fromFile', function(file) {
        this.assert(
            this._obj === fs.readFileSync(file, { encoding: 'utf-8' }),
            "expected #{this} to equal text from file " + file,
            "expected #{this} to not equal text from file " + file)
    })

    /**
     * Checks if the ips are the same
     */
    chai.Assertion.addMethod('sameIp', function(ip) {
        this.assert(
            this._obj === 'localhost' && ip === '127.0.0.1'
            || this._obj === '127.0.0.1' && ip === 'localhost'
            || this._obj === ip,
            "expected #{this} to be the same ip as " + ip,
            "expected #{this} to not be the same ip as " + ip)
    })
}
