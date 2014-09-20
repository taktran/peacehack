/**
 * envService
 *
 * Environment singleton object to get environment
 * options.
 */
angular.module('app').factory('envService', function(
  $window,
  ENV_OPTIONS,
  currentEnvService
) {
  "use strict";

  return {
    /**
     * Get environment option from `ENV_OPTIONS`
     * hash.
     *
     * @param {String} Option to get
     * @return {String|Object} Environment object
     */
    option: function(opt) {
      if (!currentEnvService) { return; }

      var envOptions = ENV_OPTIONS[currentEnvService];
      if (!envOptions) { return; }

      return envOptions[opt];
    },

    /**
     * Get the api base url (with trailing /). This is the
     * base url as the api base unless it is overriden in
     * `ENV_OPTIONS`.
     *
     * @return {String} Base url
     */
    apiBase: function() {
      var apiBaseOverride = this.option('apiBase');
      var output;

      if (apiBaseOverride) {
        output = apiBaseOverride;
      } else {
        output = $window.location.protocol + "//" + $window.location.hostname + ($window.location.port ? ':' + $window.location.port: '') + "/";
      }

      // Append trailing / if it is missing
      if (!output.match(/\/$/)) {
        output = output + "/";
      }

      return output;
    }
  };
});