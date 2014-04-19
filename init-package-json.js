var fs = require('fs')
  , path = require('path')
  , promzard = require('promzard')
  , read = require('read');

var input = path.resolve(__dirname, 'ini', 'package-json.js')
  , extras = [ 'description',
               'author',
               'repository',
               'homepage',
               'bugs',
               'dependencies',
               'devDependencies',
               'peerDependencies',
               'optionalDependencies' ];

module.exports = function (outfile, ctx, cb) {
  promzard(input, ctx, function (err, data) {
    if (err) return cb(err);
    extras.forEach(function (prop) {
      if (prop in data) {
        if (!data[prop] || (typeof data[prop] === 'object' && Object.keys(data[prop]).length === 0)) {
          delete data[prop];
        }
      }
    });
    var d = JSON.stringify(data, null, 2);
    console.log('About to write to %s:\n\n%s\n', outfile, d);
    read({prompt:'Is this ok? ', default: 'yes'}, function (er, ok) {
      if (!ok || ok.toLowerCase().charAt(0) !== 'y') {
        console.log('Aborted.');
        cb();
      } else {
        fs.writeFile(outfile, d, 'utf8', function (err) {
          return cb(err, data);
        });
      }
    });
  });
};
