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

// Keys that can be configured
const CONFIG_KEYS = [ 'port', 'host', 'root', 'static', 'notFound' ]

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
        this.root = 'index.html'
        this.notFound = null

        // Bind methods
        this.configure = this.configure.bind(this)
        this.serve = this.serve.bind(this)
        this._handleRequest = this._handleRequest.bind(this)
        this._handleError = this._handleError.bind(this)
        this._sendFile = this._sendFile.bind(this)
        this._handleNotFound = this._handleNotFound.bind(this)
        this._handleNotFoundString = this._handleNotFoundString.bind(this)
        this._handleNotFoundObject = this._handleNotFoundObject.bind(this)
        this._handleNotFoundDefault = this._handleNotFoundDefault.bind(this)
        this._filepath = this._filepath.bind(this)
        this._exists = this._exists.bind(this)

        // Set events
        this.on('request', this._handleRequest)
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
    _handleRequest(request, response) {
        // Send root if accessing root folder
        if (request.url === '/')
            this._exists(this._filepath(this.root), (error, exists) => {
                // Report error if there is one
                if (error) this._handleError(error, response)
                // Send root file if it exists
                else if (exists) this._sendFile(this.root, response)
                // Send not found response
                else this._handleNotFound(response)
            })
        // Send file
        else
            this._exists(this._filepath(request.url), (error, exists) => {
                // Report error if there is one
                if (error) this._handleError(error, response)
                // Send file if it exists
                else if (exists) this._sendFile(request.url, response)
                // Send not found response
                else this._handleNotFound(response)
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
    _handleError(error, response) {
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
    _handleNotFound(response) {
        // Send given filename with 404 status if given string
        if (typeof(this.notFound) === 'string') this._handleNotFoundString(response)
        // Send given filename with given status if given object
        else if (this.notFound) this._handleNotFoundObject(response)
        // Send default file
        else this._handleNotFoundDefault(response)
    }

    /**
     * @private
     *
     * Handle not found string property
     *
     * @param response {http.ServerResponse} the outgoing response
     */
    _handleNotFoundString(response) {
        this._exists(this._filepath(this.notFound), (error, exists) => {
            // Report error if there is one
            if (error) this._handleError(error, response)
            // Send 404 file if it exists
            else if (exists) this._sendFile(this.notFound, response, 404)
            // Send default 404 otherwise
            else this._handleNotFoundDefault(response)
        })
    }

    /**
     * @private
     *
     * Handle not found object property
     *
     * @param response {http.ServerResponse} the outgoing response
     */
    _handleNotFoundObject(response) {
        this._exists(this._filepath(this.notFound.file), (error, exists) => {
            // Report error if there is one
            if (error) this._handleError(error, response)
            // Send 404 file if it exists
            else if (exists) this._sendFile(
                this.notFound.file, response, this.notFound.status)
            // Send default 404 otherwise
            else this._handleNotFoundDefault(response)
        })
    }

    /**
     * @private
     *
     * Default handler for not found
     *
     * @param response {http.ServerResponse} the outgoing response
     */
    _handleNotFoundDefault(response) {
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
