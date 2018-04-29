/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */

// Defaults
const DEFAULT_PORT = 80
const DEFAULT_HOST = '0.0.0.0'
const DEFAULT_STATIC = 'public'
const DEFAULT_NOTFOUND = null

// Keys that can be configured
const CONFIG_KEYS = [ 'port', 'host', 'static', 'notFound' ]

/**
 * Main server class
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 27 - 2017
 */
export default class ServeKaro {
    /**
     * Constructs a new ServeKaro
     */
    constructor() {
        // Default properties
        this.port = 80,
        this.host = '0.0.0.0',
        this.static = 'public',
        this.notFound = null
    }

    /**
     * Configures the servekaro using
     */
    configure(opts) {
        // Filter configKeys from object
        let trueOpts = Object.entries(opts)
            .filter(([key, value]) => CONFIG_KEYS.includes(key))
            .reduce((obj, [key, val]) => Object.assign(obj, {[key]: val}), {})

        // Assign keys to ServeKaro
        Object.assign(this, trueOpts)
    }
}
