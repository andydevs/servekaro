#!/usr/bin/env node
/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */
import makeConfig from '../lib/make-config'
import servekaro from '../lib/servekaro'
import fs from 'fs'

// Set process name
process.title = 'servekaro'

// Config file
const CONFIG_FILE_NAME = 'servekaro.json'

// Make config
var config = makeConfig(CONFIG_FILE_NAME)

// Serve server
servekaro(config, () => {
    let { serving, host, port } = config;
    console.log(`Serving '${serving}/' at 'http://${host}:${port}/'`)
    console.log('Type ^C to terminate...');
    console.log('');
})
