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
import { fileExists, filterKeys } from './helper'

// Keys that can be configured
const CONFIG_KEYS = [ 'port', 'host', 'root', 'serving', 'notFound' ]

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
        this.port = process.env.PORT || 80
        this.host = process.env.HOST || '0.0.0.0'
        this.serving = 'public'
        this.root = 'index.html'
        this.notFound = null

        // Bind methods
        this.configure = this.configure.bind(this)
        this.serve = this.serve.bind(this)
        this._handleRequest = this._handleRequest.bind(this)
        this._handleRequestRoot = this._handleRequestRoot.bind(this)
        this._handleRequestDefault = this._handleRequestDefault.bind(this)
        this._handleError = this._handleError.bind(this)
        this._sendFile = this._sendFile.bind(this)
        this._handleNotFound = this._handleNotFound.bind(this)
        this._handleNotFoundString = this._handleNotFoundString.bind(this)
        this._handleNotFoundObject = this._handleNotFoundObject.bind(this)
        this._handleNotFoundDefault = this._handleNotFoundDefault.bind(this)
        this._filepath = this._filepath.bind(this)

        // Set events
        this.on('request', this._handleRequest)
    }

    /**
     * Configures the servekaro using the given opts object
     *
     * @param opts {Object} the options object
     */
    configure(opts) {
        Object.assign(this, filterKeys(opts, CONFIG_KEYS))
    }

    /**
     * Serves content from server
     *
     * @param callback {Function} callback handler for server
     *
     * @return http server created
     */
    serve(callback) {
        return this.listen({ port: this.port, host: this.host }, callback)
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
        if (request.url === '/') this._handleRequestRoot(response)
        // Handle default request
        else this._handleRequestDefault(request, response)
    }

    /**
     * @private
     *
     * Handler for http root request
     *
     * @param response {http.ServerResponse} the outgoing response
     */
    _handleRequestRoot(response) {
        fileExists(this._filepath(this.root), (error, exists) => {
            // Report error if there is one
            if (error) this._handleError(error, response)
            // Send root file if it exists
            else if (exists) this._sendFile(this.root, response)
            // Send not found response
            else this._handleNotFound(response)
        })
    }

    /**
     * @private
     *
     * Default handler for http request
     *
     * @param response {http.ServerResponse} the outgoing response
     */
    _handleRequestDefault(request, response) {
        fileExists(this._filepath(request.url), (error, exists) => {
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
        fileExists(this._filepath(this.notFound), (error, exists) => {
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
        fileExists(this._filepath(this.notFound.file), (error, exists) => {
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
     * Returns the filepath including serving dir given the url
     *
     * @param url {String} the url from the http request
     *
     * @return the filepath including serving dir
     */
    _filepath(url) {
        return path.join(this.serving, url)
    }
}
