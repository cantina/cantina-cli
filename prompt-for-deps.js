var read = require('read')
  , async = require('async')
  , available = require('./ini/available-modules');

var required = ['cantina']
  , options = Object.keys(available)
      .filter(function (opt) { return required.indexOf(opt) === -1; })
      .sort(function (a, b) {
        if (available[a].requirements) {
          if (available[b].requirements) return sortByRequirements(a, b);
          else return 1;
        }
        else if (available[b].requirements) {
          return -1;
        }
        else {
          return sortByKey(a, b);
        }
      });

module.exports = function (cb) {
  var hash = {}
    , rejected = [];

  required.forEach(function (label) {
    getDeps(label);
  });

  console.log('Load the following cantina plugins?');
  console.log('');

  async.whilst(
    function () { return options.length; },
    function (next) {
      var current = options.shift();
      if (available[current].requirements && available[current].requirements.some(function (requirement) { return ~rejected.indexOf(requirement); })) {
        rejected.push(current);
        return next();
      }
      read({
        prompt: current,
        default: 'yes'
      }, function (err, answer) {
        if (err) return next(err);
        if (answer && answer.toLowerCase().charAt(0) === 'y') {
          getDeps(current);
        }
        else {
          rejected.push(current);
        }
        next();
      });
    },
    function (err) {
      if (err) return cb(err);
      var keys = Object.keys(hash).sort(sortByKey);
      var result = keys.reduce(function (result, key) {
        var dep = key.split(':', 1).shift()
          , name = key.substring(dep.length + 1);
        result[dep] || (result[dep] = {});
        result[dep][name] = hash[key];
        return result;
      }, {});
      cb(null, result);
    });

  function getDeps (label) {
    return ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies'].forEach(function (dep) {
      if (available[label][dep]) {
        Object.keys(available[label][dep]).forEach(function (name) {
          var key = dep + ':' + name;
          if (!(key in hash)) {
            hash[key] = available[label][dep][name];
          }
        });
      }
    });
  }
};

/**
 * cantina-*
 * cantina-app-*
 * cantina-app-ui-*
 */
function sortByKey (a, b) {
  var aSplits = a.split('-').slice(1, 3), bSplits = b.split('-').slice(1, 3);

  if (aSplits.join('-') === 'app-ui') {
    if (bSplits.join('-') === 'app-ui') return a > b ? 1 : (a < b ? -1 : 0);
    else return 1;
  }
  if (bSplits.join('-') === 'app-ui') {
    return -1;
  }
  if (aSplits[0] === 'app') {
    if (bSplits[0] === 'app') return a > b ? 1 : (a < b ? -1 : 0);
    else return 1;
  }
  if (bSplits[0] === 'app') {
    return -1;
  }
  return a > b ? 1 : (a < b ? -1 : 0);
}

function sortByRequirements (a, b) {
  if (~available[b].requirements.indexOf(a)) {
    if (~available[a].requirements.indexOf(b)) return 0;
    else return -1;
  }
  if (~available[a].requirements.indexOf(b)) {
    return 1;
  }
  return 0;
}
