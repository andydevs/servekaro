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
        this._exists(this._filepath(request.url), (error, exists) => {
            // Report error if there is one
            if (error) this._reportError(error, response)
            // Send file if it exists
            else if (exists) this._sendFile(request.url, response)
            // Send not found response
            else this._reportNotFound(response)
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
     * @param url {String} the url string
     * @param response {http.ServerResponse} the outgoing response
     * @param status {int} the status to write to response
     */
    _sendFile(url, response, status=200) {
        response.writeHead(status)
        fs.createReadStream(this._filepath(url)).pipe(response)
    }

    /**
     * @private
     *
     * Handle not found
     *
     * @param response {http.ServerResponse} the outgoing response
     */
    _reportNotFound(response) {
        // Send given 404 string if given
        if (typeof(this.notFound) === 'string')
            this._exists(this._filepath(this.notFound), (error, exists) => {
                // Report error if there is one
                if (error) this._reportError(error, response)
                // Send 404 file if it exists
                else if (exists) this._sendFile(this.notFound, response, 404)
                // Send default 404 otherwise
                else this._reportNotFoundDefault(response)
            })
        // Send default file
        else this._reportNotFoundDefault(response)
    }

    /**
     * @private
     *
     * Default handler for not found
     *
     * @param response {http.ServerResponse} the outgoing response
     */
    _reportNotFoundDefault(response) {
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

    /**
     * @private
     *
     * Check if the file exists and return boolean
     * (since fs.exists is deprecated)
     *
     * @param path {String} the path to check
     * @param callback {Function} callback to responds to exists
     */
    _exists(file, callback) {
        fs.stat(file, (error, stat) => {
            // Check error
            if (error)
                // ENOENT (Error No Entry) indicates file does not exist
                if (error.code === 'ENOENT') callback(null, false)
                // Other errors are just system errors
                else callback(error, false)
            // Url exists if stat is file
            else if (stat.isFile()) callback(null, true)
            // Else url does not exist
            else callback(null, false)
        })
    }
}
