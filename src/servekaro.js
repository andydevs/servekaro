/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */

/**
 * Main server class
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 27 - 2017
 */
export default class ServeKaro {
    constructor() {
        // Default properties
        this.port = 80,
        this.host = '0.0.0.0',
        this.static = 'public',
        this.notFound = null
    }
}
