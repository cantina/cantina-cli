#!/usr/bin/env node

var program = require('commander')
  , pkg = require('../package.json')
  , path = require('path')
  , cwd = process.cwd()
  , npm = require('npm');

if (cwd === path.resolve(__dirname, '../')) {
  console.error(path.basename(process.argv[1]) + ': must be run in an empty directory');
  process.exit(65);
}

var cmdFound = false;

program.version(pkg.version);
program
  .command('init')
  .description('Initialize a directory for a new cantina app')
  .action(init);
program.parse(process.argv);

cmdFound || program.help();

function init () {
  cmdFound = true;
  var promptForDeps = require('../prompt-for-deps');
  var initPackageJson = require('../init-package-json');
  var copySkel = require('../copy-skel');

  console.log('');
  // 1. Prompt for desired cantina plugins
  promptForDeps(function (err, results) {
    var plugins = [];
    if (err) return die(err);
    console.log('');
    if (results.dependencies) {
      plugins = Object.keys(results.dependencies);
    }
    // 2. Create package.json
    initPackageJson(path.resolve(cwd, 'package.json'), results, function (err, data) {
      if (err) return die(err);
      // No data means we aborted
      if (!data) die();
      // 3. Copy skeleton directories
      copySkel({ main: data.main, plugins: plugins }, function (err) {
        if (err) return die(err);
        // 4. `npm install`
        npm.load({}, function (err) {
          if (err) return die(err);
          npm.commands.install(die);
        });
      });
    });
  });
}

function die (err) {
  if (err) throw err;
  process.exit(0);
}
