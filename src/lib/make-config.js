/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import fs from 'fs'

// Default config
const defaultConfig = {
    host: { env: 'HOST', default: '0.0.0.0' },
    port: { env: 'PORT', default: 80 },
    serving: 'public',
    root: 'index.html'
}

/**
 * Makes config object according to file name. If filename does not exist,
 * return default config. Else return config from filename, with config
 * values not set set to default config values
 *
 * @param {string} filename name of config file
 *
 * @return {object} servekaro config
 */
export default function makeConfig(filename) {
    try {
        var customConfig = JSON.parse(fs.readFileSync(filename))
        return { ...defaultConfig, ...customConfig }
    } catch (e) {
        return defaultConfig
    }
}
