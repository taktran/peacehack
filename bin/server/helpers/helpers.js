var _ = require('lodash');

module.exports = {
  errorMessage: function(url, error, response, body) {
    var statusCode = _.isObject(response) ? response.statusCode : "[response undefined]";

    return url +
      "\nerror: " + error +
      "\nstatus: " + statusCode +
      "\nbody: " + body;
  },

  successResponse: function(resp) {
    return {
      "statusCode": 200,
      "message": resp
    };
  }
};