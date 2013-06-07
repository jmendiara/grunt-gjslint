# grunt-gjslint

> Validate files with Google Linter.

## Getting Started
This plugin requires Grunt `~0.4.1` and *just* python installed

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-gjslint --save-dev
```

One the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-gjslint');
```

## The "gjslint" task
Run this task with the `grunt gjslint` command.

### Overview
In your project's Gruntfile, add a section named `gjslint` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  gjslint: {
    options: {
      flags: [
        '--disable 220' //ignore error code 220 from gjslint
      ],
      reporter: {
        name: 'console'
      }
    },
    all: {
      src: '<%= jshint.all %>'
    }
  }
})
```

As this is a Multitask, you can specify several targets to be called sharing the same root options

### Documentation
grunt-gjslint uses [node-closure-linter-wrapper](https://github.com/jmendiara/node-closure-linter-wrapper)
to lint files

### Options

#### flags
Type: `Array` Default value: `[]`

Please, refer to [node-closure-linter-wrapper documentation](https://github.com/jmendiara/node-closure-linter-wrapper)
for flags reference.

#### reporter
Type: `Object` Default value: `{}`

Please, refer to [node-closure-linter-wrapper documentation](https://github.com/jmendiara/node-closure-linter-wrapper)
for reporter reference.

#### reporterOutput
`options.reporterOutput`

Type: `String` Default value: null

Specify a filepath to write the results of a reporter into a file instead of printed to stdout.

#### force
Type: `Boolean` Default value: `false`

Set `force` to `true` if:
- You want gsjlint to report errors but not fail the task.
- You want gsjlint not to fail the task when python is not installed on the computer.

### Usage Examples

Use a flag file to store the closure-linter flags, and have two different source directories.
Output the lint results to the console. You can use wildcards in file paths.

```js
grunt.initConfig({
  gjslint: {
    options: {
      flags: [
        '--flagfile .gjslintrc' //use flag file
      ],
      reporter: {
        name: 'console' //report to console
      },
      force: false //don't fail if python is not installed on the computer
    },
    lib: {
      src: ['lib/module/**/*.js', 'lib/foo.js'],
    },
    test: {
      src: ['test/*.js'],
    }
  }
})
```

Use `reporterOutput` option if you want to write the output into a file instead of printing it in the console.

```js
grunt.initConfig({
  gjslint: {
    options: {
      flags: [
        '--flagfile .gjslintrc' //use flag file
      ],
      reporter: {
        name: 'gjslint_xml'
      },
      reporterOutput: 'gjslint_report.xml', // save the output to this file
      force: true //don't fail the task
    },
    lib: {
      src: ['lib/module/**/*.js', 'lib/foo.js'],
    }
  }
})
```


## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* v0.1.0
  * First version
