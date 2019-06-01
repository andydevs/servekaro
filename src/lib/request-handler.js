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
 * Write internal server error to response
 *
 * @param {ServerResponse} response response object
 */
export function handleError(response) {
    response.writeHead(500, { 'Content-Type' : 'text/plain' })
    response.write('Internal server error!')
    response.end()
}
