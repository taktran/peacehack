var fs = require('fs');
var path = require('path');
var q = require('q');
var _ = require('lodash');

function getJson(filePath) {
  var deferred = q.defer();

  fs.readFile(filePath, { encoding: 'utf-8' }, function(err, data) {
    if (!err) {
      try {
        var json = JSON.parse(data);
        deferred.resolve(json);
      } catch (e) {
        deferred.reject(e);
      }
    } else {
      deferred.reject("Error reading:", filePath);
    }
  });

  return deferred.promise;
}

module.exports = function(root) {
  // TODO: Duplicate of front end config
  var dataFileNames = [
    "war",
    "peace",
    "gaza",
    "syria",
    "london"
  ];

  var dataFilePromiseMappings = {};
  _.each(dataFileNames, function(name) {
    dataFilePromiseMappings[name] = getJson(path.join(root, "/data/" + name + ".json"));
  });

  return dataFilePromiseMappings;
};