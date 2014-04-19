var fs = require('fs')
  , path = require('path')
  , async = require('async')
  , hardhat = require('hardhat')
  , cwd = process.cwd()
  , basename = path.basename(cwd)
  , skel = path.resolve(__dirname, 'skel')
  , available = require('./ini/available-modules');

module.exports = function (params, cb) {
  var main = params.main || basename + '.js'
    , choices
    , ctx = {};

  if (Array.isArray(params.plugins)) {
    choices = Object.keys(available).filter(function (opt) {
      return ~params.plugins.indexOf(opt);
    });
  }

  if (choices.length) {
    ctx = {
      basename: path.basename(main, '.js'),
      title: path.basename(main, '.js').replace('-', ' ').replace(/\b([a-z])/g, function (match) { return match.toUpperCase(); }),
      plugins: choices.filter(function (opt) { return opt !== 'cantina' && opt !== 'cantina-log'; })
    };
    choices.forEach(function (opt) {
      ctx[opt] = true;
    });
    async.each(choices, function (plugin, next) {
      var dirIn = path.resolve(skel, plugin);
      if (!fs.existsSync(dirIn)) return next();
      hardhat.scaffold(dirIn, cwd, {
        data: ctx
      }, next);
    }, function (err) {
      if (err) return cb(err);
      fs.rename(path.resolve(cwd, 'app.js'), path.resolve(cwd, main), function (err) {
        if (err) return cb(err);
        fs.symlink(main, path.resolve(cwd, 'app.js'), function (err) {
          if (err) return cb(err);
          cb();
        });
      });
    });
  }
  else cb();
};
