/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import http from 'http'
import path from 'path'
import fs from 'fs'

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
export default class ServeKaro extends http.Server {
    /**
     * Constructs a new ServeKaro
     */
    constructor() {
        // Call super
        super()

        // Default properties
        this.port = 80
        this.host = '0.0.0.0'
        this.static = 'public'
        this.notFound = null

        // Bind methods
        this.configure = this.configure.bind(this)
        this.serve = this.serve.bind(this)
        this._requestHandler = this._requestHandler.bind(this)
        this._filepath = this._filepath.bind(this)

        // Set events
        this.on('request', this._requestHandler)
    }

    /**
     * Configures the servekaro using the given opts object
     *
     * @param opts {Object} the options object
     */
    configure(opts) {
        // Filter CONFIG_KEYS from object
        let trueOpts = Object.entries(opts)
            .filter(([key, value]) => CONFIG_KEYS.includes(key))
            .reduce((obj, [key, val]) => Object.assign(obj, {[key]: val}), {})

        // Assign keys to ServeKaro
        Object.assign(this, trueOpts)
    }

    /**
     * Serves content from server
     *
     * @param callback {Function} callback handler for server
     */
    serve(callback) {
        this.listen({ port: this.port, host: this.host }, callback)
    }

    /**
     * @private
     *
     * Handler for http request events
     *
     * @param request {http.IncomingMessage} the incoming request
     * @param response {http.ServerResponse} the outgoing response
     */
    _requestHandler(request, response) {
        fs.stat(this._filepath(request.url), (error, stats) => {
            if (error)
                // Send not found information if file is not found
                if (error.code === 'ENOENT') this._reportNotFound(response)
                // Report error if error
                else this._reportError(error, response)
            // Send user the file if requested file exists
            else this._sendFile(request, response)
        })
    }

    /**
     * @private
     *
     * Reports an internal server error to the user
     *
     * @param error {Error} the error to report
     * @param response {http.ServerResponse} the outgoing response
     */
    _reportError(error, response) {
        response.writeHead(500, { 'Content-Type': 'text/plain' })
        response.write('Internal server error!: ' + error.toString())
        response.end()
    }

    /**
     * @private
     *
     * Sends requested file to response
     *
     * @param request {http.IncomingMessage} the incoming request
     * @param response {http.ServerResponse} the outgoing response
     */
    _sendFile(request, response) {
        fs.createReadStream(this._filepath(request.url)).pipe(response)
    }

    /**
     * @private
     *
     * Handle not found
     *
     * @param response {http.ServerResponse} the outgoing response
     */
    _reportNotFound(response) {
        response.writeHead(404, { 'Content-Type' : 'text/plain' })
        response.write('File not found!')
        response.end()
    }

    /**
     * @private
     *
     * Returns the filepath including static dir given the url
     *
     * @param url {String} the url from the http request
     *
     * @return the filepath including static dir
     */
    _filepath(url) {
        return path.join(this.static, url)
    }
}
