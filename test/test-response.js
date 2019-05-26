/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import { Writable } from 'stream';

export default class TestResponse extends Writable {
    constructor(opts={}) {
        super(opts)
        this.data = ''
        this.status = 200
        this.headers = {}
    }

    writeHead(status, headers) {
        this.status = status
        this.headers = Object.assign(this.headers, headers)
    }

    _write(chunk, encoding='utf-8', callback=(()=>{})) {
        this.data += chunk
        callback()
    }
}
