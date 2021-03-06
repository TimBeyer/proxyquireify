'use strict';

var through          =  require('through')
  , findDependencies =  require('./find-dependencies')
  , excludes =  {}
  , prelude  =
      '/*proxyquireify override */;var require_ = require;'
    + 'var require = require(\'proxyquireify\').proxy(require_);\n'
    ;

function requireDependencies(src) {
  var deps = findDependencies(src);
  if (!deps.length) return '';
  return '/* proxyquireify injected requires to make browserify include dependencies in the bundle */;' +
    deps.map(function (x) { return 'require(\'' + x + '\')'; }).join(';') + ';';
}

module.exports = function (file) {
  if (file === require.resolve('../index')) return through();
  var data = '';

  return through(write, end);
    
  function write (buf) { data += buf; }
  function end() {
    var deps = requireDependencies(data);
    this.queue(deps);
    this.queue(prelude);
    this.queue(data);
    this.queue(null);
  }
};
