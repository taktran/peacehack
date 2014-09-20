var fs = require('fs');
var path = require('path');
var q = require('q');

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
  var WAR_DATA_PATH = path.join(root, "/data/war.json");
  var PEACE_DATA_PATH = path.join(root, "/data/peace.json");

  return {
    war: getJson(WAR_DATA_PATH),
    peace: getJson(PEACE_DATA_PATH)
  };
};