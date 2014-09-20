'use strict';

describe('envService', function() {
  var setupMocks;
  var env;

  beforeEach(angular.mock.module('app'));

  beforeEach(function() {

    setupMocks = function(options, currentEnv, windowObj) {

      // Dependency inject values
      angular.mock.module(function($provide) {

        if (windowObj) {
          $provide.value('$window', windowObj);
        }
        $provide.constant('ENV_OPTIONS', options);
        $provide.constant('currentEnvService', currentEnv);
      });

      // NOTE: Need to reinitialise each time
      // so that the dependency injected values
      // are reinitialised
      inject(function(_envService_) {
        env = _envService_;
      });
    };
  });

  describe("option()", function() {
    it("returns current environment option", function() {
      setupMocks({
        "test": {
          "killerCombo": "123"
        }
      }, "test");

      expect(env.option('killerCombo')).toEqual("123");
    });

    it("returns undefined if option is not available", function() {
      setupMocks({}, "test");
      expect(env.option('killerCombo')).toBeUndefined();
    });

    it("returns undefined if currentEnvironment is undefined", function() {
      setupMocks({}, undefined);
      expect(env.option('killerCombo')).toBeUndefined();
    });
  });

  describe("apiBase()", function() {
    it("returns the base url (localhost)", function() {
      setupMocks(null, null, window);
      expect(env.apiBase()).toMatch(/^http:\/\/localhost/);
    });

    describe("with `apiBase` override", function() {

      function envWithUrl(url) {
        var options = {
          "test": {
            apiBase: url
          }
        };

        setupMocks(options, "test");
      }

      it("returns the base url", function() {
        envWithUrl("http://something.com/");
        expect(env.apiBase()).toMatch(/http:\/\/something.com\//);
      });

      it("appends a / to the base url if it is missing", function() {
        envWithUrl("http://something.com");
        expect(env.apiBase()).toMatch(/http:\/\/something.com\//);
      });
    });
  });
});