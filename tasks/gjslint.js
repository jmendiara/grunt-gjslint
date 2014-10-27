/*
 * grunt-gjslint
 * https://github.com/jmendiara/grunt-gjslint
 *
 * Copyright (c) 2013 Javier Mendiara Cañardo
 * Licensed under the MIT license.
 */

'use strict';

var gjslint = require('closure-linter-wrapper').gjslint;
var fixjsstyle = require('closure-linter-wrapper').fixjsstyle;

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('gjslint', 'Validate files with Google Linter',
    function() {
      var done = this.async();
      var options = this.options({
        force: true,
        reporter: {},
        flags: []
      });

      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
        var srcs = expandFiles(f.src);
        var doneCount = 0;
        var isDone = true;
        
        var doneCheck = function(gjsDone) {
          if (!gjsDone) {
            isDone = false;
          }
          
          if (++doneCount === srcs.length) {
            done(isDone);
          }
        };
        
        var callback = function(err, res) {
          var gjsDone = !(err && (err.code !== 1 || options.force));
          doneCheck(gjsDone);
        };

        for (var i = 0, len = srcs.length; i < len; ++i) {
          gjslint({
            flags: options.flags,
            reporter: options.reporter,
            src: [srcs[i]]
          }, callback);
        }
      });
    }
  );

  grunt.registerMultiTask('fixjsstyle', 'Fix files with Google Linter',
    function() {
      var done = this.async();
      var options = this.options({
        force: true,
        reporter: {},
        flags: []
      });

      // Iterate over all specified file groups.
      this.files.forEach(function(f) {
        var srcs = expandFiles(f.src);
        var doneCount = 0;
        var isDone = true;
        
        var doneCheck = function(gjsDone) {
          if (!gjsDone) {
            isDone = false;
          }
          
          if (++doneCount === srcs.length) {
             done(isDone);
          }
        };
        
        var callback = function(err, res) {
          var gjsDone = !(err && (err.code !== 1 || options.force));
          doneCheck(gjsDone);
        };

        for (var i = 0, len = srcs.length; i < len; ++i) {
          fixjsstyle({
            flags: options.flags,
            reporter: options.reporter,
            src: [srcs[i]]
          }, callback);
        }
      });
    }
  );

  function expandFiles(files) {
    var retArray = [];
    if (files) {
      var allFiles = grunt.file.expand(files)
        .filter(function(filepath) {
          // Warn on and remove invalid source files (if nonull was set).
          if (!grunt.file.exists(filepath)) {
            grunt.log.warn('Source file "' + filepath + '" not found.');
            return false;
          } else {
            return true;
          }
        })
        .map(function(filePath) {
          // Wrap the path between double quotes when whitespaces found.
          return (filePath.indexOf(' ') === -1) ? filePath :
            ['"', filePath, '"'].join('');
        });
      // command line will be too long in Windows
      // http://support.microsoft.com/kb/830473.
      for (var i = 0, lineLen = 0; i < allFiles.length; ++i) {
        var file = allFiles[i];
        lineLen += file.length + 1;
        if (lineLen > 7500) {
          retArray.push(allFiles.splice(0, i).join(' '));
          i = -1;
          lineLen = 0;
        }
      }
      retArray.push(allFiles.join(' '));
    }
    return retArray;
  }
};
