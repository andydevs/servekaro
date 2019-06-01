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
import { sendFile } from './helper'

/**
 * Return appropriate not found handler for config
 *
 * @param {object} config servekaro config
 *
 * @return {function} not found handler for config
 */
export default function getHandleNotFoundForConfig(config) {
    switch (typeof(config.notFound)) {
        case 'string':
            return handleNotFoundString;
        case 'object':
            return handleNotFoundObject;
        default:
            return handleNotFoundDefault;
    }
}

/**
 * Write object not found to response
 *
 * @param {object} config servekaro config
 * @param {ServerResponse} response response object
 */
export function handleNotFoundObject(config, response) {
    sendFile(config, config.notFound.file, response, config.notFound.status)
}

/**
 * Write string not found to response
 *
 * @param {object} config servekaro config
 * @param {ServerResponse} response response object
 */
export function handleNotFoundString(config, response) {
    sendFile(config, config.notFound, response, 404)
}

/**
 * Write default not found to response
 *
 * @param {ServerResponse} response response object
 */
export function handleNotFoundDefault(response) {
    response.writeHead(404, { 'Content-Type' : 'text/plain' })
    response.write('File not found!')
    response.end()
}
