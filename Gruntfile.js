/*
 * grunt-gjslint
 * https://github.com/jmendiara/grunt-gjslint
 *
 * Copyright (c) 2013 Javier Mendiara Cañardo
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    gjslint: {
      all: {
        options: {
          flags: [
            '--flagfile .gjslintrc'
          ],
          reporter: {
            name: 'console'
          }
        },
        src: '<%= jshint.all %>'
      },
      testReporterOutput: {
        options: {
          flags: [
            '--flagfile .gjslintrc'
          ],
          reporter: {
            name: 'gjslint_xml'
          },
          reporterOutput: 'tmp/gjslint_report.xml',
          force: true
        },
        src: ['test/fixtures/test.js']
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }

  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');
  grunt.loadNpmTasks('grunt-release');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'gjslint', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);

};
