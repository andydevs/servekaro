/**
 * Serve Karo
 *
 * Static web server
 *
 * Author:  Anshul Kharbanda
 * Created: 4 - 24 - 2017
 */

/**
 * Configures grunt instance
 *
 * @param {Grunt} grunt grunt instance
 */
module.exports = function (grunt) {
    // Initialize config
    grunt.initConfig({
        babel: {
            options: {
                sourceMap: false,
                presets: ["@babel/preset-env"]
            },
            dist: {
                files: {
                    'lib/helper.js': 'src/lib/helper.js',
                    'lib/servekaro.js': 'src/lib/servekaro.js',
                    'bin/servekaro': 'src/bin/servekaro.js'
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: '@babel/register'
                },
                src: ['test/*.js']
            }
        }
    })

    // Load tasks
    grunt.loadNpmTasks('grunt-babel')
    grunt.loadNpmTasks('grunt-mocha-test')

    // Register tasks
    grunt.registerTask('build', ['babel'])
    grunt.registerTask('test', ['build', 'mochaTest'])
}
