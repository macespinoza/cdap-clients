module.exports = function (grunt) {
    'use strict';
    // Project configuration
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        // Task configuration
        // Browser side tests
        /**
         * temporary doesn`t work.
         * More investigation required.
         */
        mocha: {
            browser: {
                src: ['test/client.html'],
                options: {
                    run: true,
                    reporter: 'Nyan',
                },
            },
        },
        // Node.JS side tests
        mochaTest: {
            nodejs: {
                src: ['test/authmanager-spec.js']
            },
        },
        concat: {
            browser_dist: {
                src: ['src/base64.js', 'src/promise.js', 'src/helper-browser.js', 'src/authmanager.js'],
                dest: 'tmp/browser/<%= pkg.name %>.js'
            },
        },
        copy: {
            nodejs_package: {
                expand: true,
                cwd: 'src/nodejs/',
                src: ['*.json', '*.js'],
                dest: 'dist/nodejs/<%= pkg.name %>/'
            },
            nodejs_src: {
                expand: true,
                cwd: 'src/',
                src: ['helper-node.js', 'authmanager.js', 'promise.js'],
                dest: 'dist/nodejs/<%= pkg.name %>/'
            },
        },
        uglify: {
            browser_dist: {
                src: '<%= concat.browser_dist.dest %>',
                dest: 'dist/browser/<%= pkg.name %>.min.js'
            }
        }
    });

    grunt.registerTask('test', [
        'mocha',
        'mochaTest'
    ]);
    grunt.registerTask('build', [
        'concat',
        'uglify',
        'copy:nodejs_src',
        'copy:nodejs_package'
    ]);
    // Default task
    grunt.registerTask('default', [
        'test',
        'build'
    ]);

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-mocha');
    grunt.loadNpmTasks('grunt-mocha-test');
};
