'user strict';
var path = require('path');
var fs = require('fs');
var rimraf = require('rimraf');
var mkdirp = require('mkdirp');
var _ = require('lodash');
var helpers = module.exports;

helpers.directory = function directory(dir) {
  return function directory(done) {
    process.chdir(__dirname);
    rimraf(dir, function (err) {
      if (err) {
        return done(err);
      }
      mkdirp(dir, function (err) {
        if (err) {
          return done(err);
        }
        process.chdir(dir);
        done();
      });
    });
  };
};

helpers.blocks = function() {
  return [
      {
        type: 'js',
        dest: 'scripts/site.js',
        searchPath: [],
        indent: '    ',
        src: [
          'foo.js',
          'bar.js',
          'baz.js'
        ],
        raw: [
          '    <!-- build:js scripts/site.js -->',
          '    <script src="foo.js"></script>',
          '    <script src="bar.js"></script>',
          '    <script src="baz.js"></script>',
          '    <!-- endbuild -->'
        ]
      }
    ];
};

helpers.css_block = function() {
  return {
        type: 'css',
        dest: '/styles/main.min.js',
        searchPath: [],
        indent: '    ',
        src: [
          'foo.js',
          'bar.js',
          'baz.js'
        ],
        raw: [
          '    <!-- build:css sstyles/main.min.css -->',
          '    <link rel="stylesheet" href="styles/main.css">',
          '    <!-- endbuild -->'
        ]
      };
};

helpers.requirejs_block = function() {
  return {
      type: 'js',
      dest: 'scripts/amd-app.js',
      searchPath: [],
      indent: '',
      requirejs: {
        dest: 'scripts/amd-app.js',
        baseUrl: 'scripts',
        name: 'main',
        origScript: 'foo/require.js',
        src: 'foo/require.js'
      },
      src: [ 'scripts/main.js' ],
      raw: [
        '<!-- build:js scripts/amd-app.js -->',
        '<script data-main="scripts/main" src="foo/require.js"></script>',
        '<!-- endbuild -->'
      ]
    };
};

helpers.createFile = function(name, dir, blocks) {
  return {
    name: name,
    blocks: blocks,
    dir: dir,
    searchPath: [dir]
  };
}

helpers.file = {
  mkdir: function(path, mode) { fs.mkdirSync(path,mode);},
  write: function(path, content) {
    return fs.writeFileSync(path, content);
  },
  copy: function(srcFile, destFile, encoding) {
  var content = fs.readFileSync(srcFile, encoding);
  fs.writeFileSync(destFile, content, encoding);
  }
};

helpers.makeFinder = function(mapping) {
    return {
    find: function (s,b) {
      var output;
      if (typeof b === 'string' || b instanceof String) {
        b = [b];
      }
      var dir = _.find(b, function(d) {return mapping[path.join(d,s)] });
      var file = typeof dir != 'undefined' ? mapping[path.join(dir,s)] : s;

      if (typeof file === 'array' || file instanceof Array) {
        output = file[0];
      } else {
        output = file;
      }
      return output;
    }
  };
};


