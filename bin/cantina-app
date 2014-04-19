#!/usr/bin/env node
var fs = require('fs')
  , path = require('path')
  , hardhat = require('hardhat');


var cwd = process.cwd()
  , skel = path.resolve(__dirname, '../skel')
  , dirname = cwd.split(path.sep).pop();

if (!fs.existsSync(path.resolve(cwd, 'package.json'))) {
  fs.writeFileSync(path.resolve(cwd, 'package.json'), fs.readFileSync(path.resolve(skel, 'package.json')));
}
if (!fs.existsSync(path.resolve(cwd, dirname + '.js'))) {
  fs.writeFileSync(path.resolve(cwd, dirname + '.js'), fs.readFileSync(path.resolve(skel, 'app.js')));
  if (!fs.existsSync(path.resolve(cwd, 'app.js'))) {
    fs.symlinkSync(dirname + '.js', path.resolve(cwd, 'app.js'));
  }
}
hardhat.scaffold(skel, cwd, {
  match: function (src) { return !src.match(/skel\/(?:app\.js|package\.json)$/); },
  data: {
    dirname: dirname
  }
}, function (err) {
  if (err) console.error(err);
  process.exit(err ? 1 : 0);
});
