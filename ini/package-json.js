var fs = require('fs')
  , path = require('path')
  , cwd = process.cwd()
  , basename = path.basename(cwd);

module.exports = {
  name: prompt('name', basename),
  version: prompt('version', '0.0.0'),
  description: prompt('description'),
  private: prompt('private', 'true', function (val) { return val !== 'false'; }),
  main: function (cb) {
    var main = module.exports.name + '.js';
    cb(null, prompt('entry point', main));
  },
  author: 'Terra Eclipse (http://terraeclipse.com/)',
  repository: {
    type: "git",
    url : function (cb) {
    fs.readFile('.git/config', 'utf8', function (er, gconf) {
      if (er || !gconf) return cb(null, prompt('git repository'));

      gconf = gconf.split(/\r?\n/);
      var i = gconf.indexOf('[remote "origin"]');
      var u;
      if (i !== -1) {
        u = gconf[i + 1];
        if (!u.match(/^\s*url =/)) u = gconf[i + 2];
        if (!u.match(/^\s*url =/)) u = null;
        else u = u.replace(/^\s*url = /, '');
      }
      if (u && u.match(/^git@github.com:/))
        u = u.replace(/^git@github.com:/, 'git://github.com/');

      return cb(null, prompt('git repository', u));
    });
  }
  },
  homepage: function (cb) {
    var repo = module.exports.repository.url;
    var homepage = repo.replace(/^git/, 'https').replace(/\.git$/, '');
    return cb(null, prompt('homepage', homepage));
  },
  bugs: {
    url: function (cb) {
    var repo = module.exports.repository.url;
    var issues = repo.replace(/^git/, 'https').replace(/\.git$/, '/issues');
    return cb(null, prompt('issues', issues));
  }
  },
  license: 'none',
  scripts: {
    test: 'make test'
  },
  dependencies: function (cb) {
    return cb(null, typeof dependencies === 'undefined' ? null : dependencies);
  },
  devDependencies: function (cb) {
    return cb(null, typeof devDependencies === 'undefined' ? null : devDependencies);
  },
  peerDependencies: function (cb) {
    return cb(null, typeof peerDependencies === 'undefined' ? null : peerDependencies);
  },
  optionalDependencies: function (cb) {
    return cb(null, typeof optionalDependencies === 'undefined' ? null : optionalDependencies);
  }
};