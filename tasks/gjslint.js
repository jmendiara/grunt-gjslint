/*
 * grunt-gjslint
 * https://github.com/jmendiara/grunt-gjslint
 *
 * Copyright (c) 2013 Javier Mendiara Cañardo
 * Licensed under the MIT license.
 */

'use strict';

var gjslint = require('closure-linter-wrapper').gjslint;
var path = require('path');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('gjslint', 'Validate files with Google Linter',
    function() {
      var done = this.async();
      var options = this.options({
        force: false,
        reporter: {},
        reporterOutput: null,
        flags: []
      });

      // Whether to output the report to a file
      var reporterOutput = options.reporterOutput;

      // Hook into stdout to capture report
      var output = '';
      if (reporterOutput) {
        grunt.util.hooker.hook(process.stdout, 'write', {
          pre: function(out) {
            output += out;
            return grunt.util.hooker.preempt();
          }
        });
      }

      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
        var src = expandFiles(f.src);

        gjslint({
          flags: options.flags,
          reporter: options.reporter,
          src: [src]
        }, function(err, res) {
          var failed = !err;

          // Allow not failing the task with errors if force is true
          // Do not fail the task when python is not installed and force is true
          if (err || (err && err.code === 1 && options.force)) {
            failed = options.force;
          }

          // Write the output of the reporter if wanted
          if (reporterOutput) {
            grunt.util.hooker.unhook(process.stdout, 'write');
            var destDir = path.dirname(reporterOutput);
            if (!grunt.file.exists(destDir)) {
              grunt.file.mkdir(destDir);
            }
            grunt.file.write(reporterOutput, output);
            grunt.log.ok('Report "' + reporterOutput + '" created.');
          }

          done(failed);
        });
      });
    }
  );

  function expandFiles(files) {
    var ret;
    if (files) {
      ret = grunt.file.expand(files).filter(function(filepath) {
        // Warn on and remove invalid source files (if nonull was set).
        if (!grunt.file.exists(filepath)) {
          grunt.log.warn('Source file "' + filepath + '" not found.');
          return false;
        } else {
          return true;
        }
      }).join(' ');
    }
    return ret;
  }
};
