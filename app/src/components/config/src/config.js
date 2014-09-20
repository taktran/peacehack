"use strict";

/**
 * Configuration object
 */
angular.module('app')

/**
 * A mapping of environments to hostnames. The application
 * uses the hostnames (values) to determine which
 * environment it is in.
 *
 * @constant {Object}
 */
.constant('ENV_HOSTNAMES', {
  // Local development
  dev: "localhost",

  production: "peacehack.herokuapp.com"
})

/**
 * Configuration object to store all the different
 * environment options
 *
 * Options that override the default:
 *
 * * `apiBase` {String} - by default `apiBase` would be the
 * hostname, but this option overrides it. NOTE: Use the
 * full form of the url ie, http://hello.com (trailing /
 * will be added if missing)
 *
 * @constant {Object}
 */
.constant('ENV_OPTIONS', {
  dev: {
    apiBase: "http://localhost:7790/"
  },
  devServer: {
  },
  preProduction: {
  },
  production: {
  }
})

/**
 * Global configuration object
 *
 * @constant {Object} CONFIG
 */
.constant('CONFIG', {
  /**
   * Timeout for getting the state of a device
   * @type {Number}
   */
  getStateTimeout: 1000,

  msgTypes: [
    'war',
    'peace'
  ]
});
