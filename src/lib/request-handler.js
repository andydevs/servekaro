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

/**
 * Build request handler from config
 *
 * @param {object} config servekaro config
 *
 * @return {function} request handler
 */
export function buildRequestHandler(config) {

}

/**
 * Returns http content type for file extension
 *
 * @param {string} ext file extension
 *
 * @return {string} http content type
 */
function contentTypeForExtension(ext) {
    switch (ext) {
        case '.html': return 'text/html'
        case '.css': return 'text/css'
        case '.js': return 'application/javascript'
        default: return 'text/plain'
    }
}

 /**
  * Returns the filepath including serving dir given the url and config
  *
  * @param {object} config servekaro config
  * @param {String} url the url from the request
  *
  * @return the filepath including serving dir
  */
export function filepath(config, url) {
    var file = url === '/' ? config.root : url
    return path.join(config.serving, file)
}

/**
 * Writes file given by url to response according to config
 *
 * @param {object} config servekaro config object
 * @param {String} url url from request
 * @param {ServerResponse} response response object
 * @param {number} status optional status to send (default: 200)
 */
export function sendFile(config, url, response, status=200) {
    var filename = filepath(config, url)
    var contentType = contentTypeForExtension(path.extname(filename))
    response.writeHead(status, { 'Content-Type' : contentType })
    fs.createReadStream(filepath(config, url)).pipe(response)
}

/**
 * Handle request and write response according to config
 *
 * @param {object} config servekaro config object
 * @param {ClientRequest} request request object
 * @param {ServerResponse} response response object
 */
export function handleRequest(config, request, response) {

}

/**
 * Write internal server error to response
 *
 * @param {ServerResponse} response response object
 */
export function handleError(response) {

}

/**
 * Write not found to response
 *
 * @param {object} config servekaro config
 * @param {ServerResponse} response response object
 */
export function handleNotFound(config, response) {

}

/**
 * Write object not found to response
 *
 * @param {object} config servekaro config
 * @param {ServerResponse} response response object
 */
export function handleNotFoundObject(config, response) {

}

/**
 * Write string not found to response
 *
 * @param {object} config servekaro config
 * @param {ServerResponse} response response object
 */
export function handleNotFoundString(config, response) {

}

/**
 * Write default not found to response
 *
 * @param {ServerResponse} response response object
 */
export function handleNotFoundDefault(response) {

}
