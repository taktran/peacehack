module.exports = {
  errorMessage: function(url, error, response, body) {
    var statusCode = response ? response.statusCode : "[response undefined]";

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