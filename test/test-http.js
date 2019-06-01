/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import { Writable } from 'stream';

/**
 * Test Response. Implementes writable functionality and writeHead
 */
export class TestResponse extends Writable {
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

/**
 * Test request. Implements url.
 */
export class TestRequest {
    constructor(url) {
        this.url = url
    }
}
