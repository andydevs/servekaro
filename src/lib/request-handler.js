/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import fs from 'fs'
import path from 'path'
import getHandleNotFoundForConfig from './handle-not-found'
import { fileExists, filepath, sendFile } from './files'

/**
 * Build request handler from config
 *
 * @param {object} config servekaro config
 *
 * @return {function} request handler
 */
export default function buildRequestHandler(config) {
    var handleNotFound = getHandleNotFoundForConfig(config)
    return function (request, response) {
        handleRequest(config, request, response, handleNotFound)
    }
}

/**
 * Handle request for url and config object
 *
 * @param {object} config servekaro config
 * @param {ClientRequest} request request object
 * @param {ServerResponse} response response object
 * @param {function} handleNotFound handler for file not found
 */
export function handleRequest(config, request, response, handleNotFound) {
    try {
        var fpath = filepath(config, request.url)
        fileExists(fpath, (error, exists) => {
            if (error) handleError(response)
            else if (exists) sendFile(config, request.url, response)
            else handleNotFound(config, response)
        })
    }
    catch (error) {
        handleError(response)
    }
}

/**
 * Write internal server error to response
 *
 * @param {ServerResponse} response response object
 */
export function handleError(response) {
    response.writeHead(500, { 'Content-Type' : 'text/plain' })
    response.write('Internal server error!')
    response.end()
}
