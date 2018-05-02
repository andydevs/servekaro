/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import ServeKaro from '../lib/servekaro'
import fs from 'fs'
import { fileExists } from 'helper'

// Config file
const CONFIG_FILE_NAME = 'servekaro.json'

// Create server
var server = new ServeKaro()

// Configure server with json file if it exists
if (fs.existsSync(CONFIG_FILE_NAME))
    server.configure(JSON.parse(fs.readFileSync(CONFIG_FILE_NAME)))

// Serve server
server.serve(() => {
    console.log(`Serving ${server.serving}/ at http://${server.host}:${server.port}/...`)
})
