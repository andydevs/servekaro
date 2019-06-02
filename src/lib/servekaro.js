/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import http from 'http'
import buildRequestHandler from './request-handler'

/**
 * Serves a servekaro server from config
 *
 * @param {object} config servekaro config
 * @param {function} callback callback called after listen function
 *
 * @return {Server} http server
 */
export default function servekaro(config, callback) {
    return servebanado(config).listen(
        resolve(config.port),
        resolve(config.host),
        callback)
}

/**
 * Resolves environment config variables
 *
 * @param {string|object} configVar config variable
 *
 * @return {any} resulting value
 */
export function resolve(configVar) {
    if (typeof(configVar) === 'object') {
        return process.env[configVar.env] || configVar.default
    } else {
        return configVar
    }
}

/**
 * Creates an http server from the given config
 *
 * @param {object} config servekaro config
 *
 * @return {Server} http server
 */
export function servebanado(config) {
    return http.createServer(buildRequestHandler(config))
}
