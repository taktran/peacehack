'use strict';

angular.module('app', [
  'ui.router',
  'angularSpectrumColorpicker'
]);

"use strict";

angular.module('app').factory('apiService', ["$http", "CONFIG", "envService", function (
  $http,
  CONFIG,
  envService
) {
  var LIGHTS_URL = envService.apiBase() + "lights/";

  function getUrl(lightId) {
    return LIGHTS_URL + lightId;
  }

  return {
    updateLight: function(lightId, red, green, blue) {
      var url = getUrl(lightId);

      return $http.post(url, {
        r: red,
        g: green,
        b: blue
      });
    },
    currentState: function(lightId) {
      var url = getUrl(lightId);

      return $http.get(url, {
        timeout: CONFIG.getStateTimeout
      });
    }
  };
}]);

"use strict";

angular.module('app').controller('ColorPickerCtrl', ["$scope", "$timeout", "apiService", "colorHelper", "light1Color", function(
  $scope,
  $timeout,
  apiService,
  colorHelper,

  light1Color
) {
  $scope.settings = {
    light1: light1Color
  };

  $timeout(function() {
    $(".color-picker-1 .sp-choose").click(function() {
      var color = colorHelper.rgbToObject($scope.settings.light1);

      apiService.updateLight(1, color.r, color.g, color.b);
    });
  });
}]);
"use strict";

/**
 * Color helper methods
 */
angular.module('app').factory('colorHelper', ["$q", "$log", "apiService", function(
  $q,
  $log,
  apiService
) {
  var colorHelper = {};

  // Color to use when color calls fail
  var fallbackColor = "rgb(0, 0, 0)";

  /**
   * Get light color using api
   *
   * @param  {String} lightId
   * @return {Promise} Promise of the light colour
   */
  colorHelper.getColor = function(lightId) {
    var deferred = $q.defer();

    apiService.currentState(lightId).then(function(resp) {
      var color = colorHelper.objectToRGB(resp.data.message);
      deferred.resolve(color);
    }).catch(function(error) {
      $log.log("Can't get light " + lightId, error);
      deferred.resolve(fallbackColor);
    });

    return deferred.promise;
  };

  /**
   * Convert color object to rgb string
   *
   * @param  {Object} color Object in the format:
   *   {
   *     r: 1,
   *     g: 2,
   *     b: 3
   *    }
   *
   * @return {String} rgbString eg, rgb(1, 2, 3)
   */
  colorHelper.objectToRGB = function(color) {
    return "rgb(" + color.r + ", " + color.g + ", " + color.b + ")";
  };

  /**
   * Parse colour into an object
   *
   * @param  {String} colorRGBString Color settings as a "rgb(r ,g, b)" value
   * @return {Object} Parsed color object in the form:
   *
   * {
   *   r: 1,
   *   g: 2,
   *   b: 3
   * }
   */
  colorHelper.rgbToObject = function(colorRGBString) {
    var color = {};
    var colorRegex = /rgb\((\d+),\s*(\d+),\s*(\d+)\)/;

    var matches = colorRGBString.match(colorRegex);

    if (matches) {
      color.r = parseInt(matches[1], 10);
      color.g = parseInt(matches[2], 10);
      color.b = parseInt(matches[3], 10);
    }

    return color;
  };

  return colorHelper;

}]);
"use strict";

angular.module('app').config(["$stateProvider", "$urlRouterProvider", function(
  $stateProvider,
  $urlRouterProvider
) {
  $stateProvider
    .state('colorPicker', {
      templateUrl: 'components/colorPicker/templates/colorPicker.html',
      url: '/admin',
      controller: 'ColorPickerCtrl',
      resolve: {
        light1Color: ["colorHelper", function(
          colorHelper
        ) {
          return colorHelper.getColor("1");
        }]
      }
    }
  );
}]);
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
  getStateTimeout: 1000
});

/**
 * currentEnvService
 *
 * Get the current environment based on the current hostname
 *
 * @return {String} Current environment. `undefined` if not found
 */
angular.module('app').factory('currentEnvService', ["$window", "ENV_HOSTNAMES", function(
  $window,
  ENV_HOSTNAMES
) {
  "use strict";

  var hostname = $window.location.hostname;
  var environment = _.reduce(ENV_HOSTNAMES, function(memo, value, env) {
    // Only find first environment that matches
    if (memo) { return memo; }

    var foundEnv;
    if (_.isArray(value)) {
      if (_.contains(value, hostname)) {
        foundEnv = env;
      }
    } else {
      if (value === hostname) {
        foundEnv = env;
      }
    }

    return foundEnv;
  }, undefined);

  return environment;
}]);
/**
 * envService
 *
 * Environment singleton object to get environment
 * options.
 */
angular.module('app').factory('envService', ["$window", "ENV_OPTIONS", "currentEnvService", function(
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
}]);
"use strict";

angular.module('app').controller('HomeCtrl', ["$scope", "$timeout", "$log", "light1Color", function(
  $scope,
  $timeout,
  $log,

  light1Color
) {
  $scope.light1 = {
    color: light1Color
  };

  $log.log($scope.light1);

  // TODO: Integrate with backend server
  var socketUrl = "http://localhost:8000";
  var socket = io(socketUrl);

  $scope.currentMsg = {};
  $scope.msgTypes = [
    'war',
    'peace'
  ];

  // Set up sockets for the different message
  // types
  _.each($scope.msgTypes, function(type) {
    var msgTitle = 'msg:' + type;
    socket.on(msgTitle, function(msg) {
      $log.log(msg);
      $timeout(function() {
        $scope.currentMsg[type] = msg;
      });
    });
  });
}]);
"use strict";

angular.module('app').config(["$stateProvider", "$urlRouterProvider", function(
  $stateProvider,
  $urlRouterProvider
) {

  // Redirect to root if unknown url
  $urlRouterProvider.otherwise('/');

  $stateProvider
    .state('home', {
      templateUrl: 'components/home/templates/home.html',
      url: '/',
      controller: 'HomeCtrl',
      resolve: {
        light1Color: ["colorHelper", function(
          colorHelper
        ) {
          return colorHelper.getColor("1");
        }]
      }
    }
  );
}]);
angular.module("app").run(["$templateCache", function($templateCache) {$templateCache.put("components/colorPicker/templates/colorPicker.html","<div class=\"color-picker-page\">\n  <h2>Administration</h2>\n  <nav>\n    <a ui-sref=\"home\">Home</a>\n  </nav>\n\n  <div class=\"light-container\">\n    <h2>Light 1\n      <span class=\"color-display\">{{ settings.light1 }}</span></h2>\n\n    <spectrum-colorpicker\n      ng-model=\"settings.light1\"\n      options=\"{ containerClassName: \'color-picker-1\', replacerClassName: \'color-picker-1-selector\' }\"\n      format=\"\'rgb\'\"></spectrum-colorpicker>\n  </div>\n</div>");
$templateCache.put("components/home/templates/home.html","<div class=\"messages\">\n  <div ng-repeat=\"type in msgTypes\">\n    <h2>{{ type }}</h2>\n    <div class=\"type-{{ type }}\">\n      {{ currentMsg[type].msg.content }}\n    </div>\n  </div>\n</div>");}]);
//# sourceMappingURL=app.js.map