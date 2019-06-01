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
 * Check if the file exists and return boolean
 * (since fs.exists is deprecated)
 *
 * @param path {String} the path to check
 * @param callback {Function} callback to responds to exists
 */
export function fileExists(path, callback) {
    fs.stat(path, (error, stat) => {
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

/**
 * Filters the given keys out of the given object
 *
 * @param object the object to filter
 * @param keys the keys to filter out
 *
 * @return the filtered object
 */
export function filterKeys(object, keys) {
    return Object.entries(object)
        // Filter out keys
        .filter(([key, value]) => keys.includes(key))
        // Map arrays to object entry
        .map(([key, value]) => ({ [key]: value }))
        // Reduce object entries into single object
        .reduce((obj, entry) => Object.assign(obj, entry), {})
}
