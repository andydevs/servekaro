#!/usr/bin/env node
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

// Set process name
process.title = 'servekaro'

// Config file
const CONFIG_FILE_NAME = 'servekaro.json'

// Create server
var server = new ServeKaro()

// Configure server with json file if it exists
if (fs.existsSync(CONFIG_FILE_NAME))
    server.configure(JSON.parse(fs.readFileSync(CONFIG_FILE_NAME)))

// Serve server
server.serve(() => {
    let { serving, host, port } = server;
    console.log(`Serving '${serving}/' at 'http://${host}:${port}/'`)
    console.log('Type ^C to terminate...');
    console.log('');
})
