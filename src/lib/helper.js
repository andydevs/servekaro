/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import fs from 'fs'

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
        .map(([key, value]) => { let obj = {}; obj[key] = value; return obj })
        // Reduce object entries into single object
        .reduce((obj, entry) => Object.assign(obj, entry), {})
}
