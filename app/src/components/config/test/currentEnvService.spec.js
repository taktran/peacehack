'use strict';

describe('currentEnvService', function() {
  var currentEnvService;
  var setupMocks;

  var location = {};
  var hostNamesMock = {};

  beforeEach(angular.mock.module('app'));

  beforeEach(function() {

    // Dependency inject values with global objects.
    // Global objects can then be changed in the
    // tests when need be.
    angular.mock.module(function($provide) {
      $provide.value('$window', {
        location: location
      });
      $provide.constant('ENV_HOSTNAMES', hostNamesMock);
    });

    setupMocks = function(url, hostNamesMockVal) {
      // Update dependency injected values
      location = {
        hostname: url
      };
      _.extend(hostNamesMock, hostNamesMockVal);

      // NOTE: Need to reinitialise each time
      // so that the dependency injected values
      // are reinitialised
      inject(function(_currentEnvService_) {
        currentEnvService = _currentEnvService_;
      });
    };
  });

  it("returns current environment from window location", function() {
    setupMocks("testingUrl.com", {
      test: "testingUrl.com"
    });

    expect(currentEnvService).toEqual("test");
  });

  it("returns undefined if hostname not found", function() {
    setupMocks("somethingElse.com", {
      test: "testingUrl.com"
    });

    expect(currentEnvService).toBeUndefined();
  });

  describe("with an array of hostnames", function() {
    var hostnames;

    beforeEach(function() {
      hostnames = {
        test: [
          "world.com",
          "world2.com"
        ]
      };
    });

    it("returns the current environment with any of the values of the array", function() {

      setupMocks("world.com", hostnames);
      expect(currentEnvService).toEqual("test");

      setupMocks("world2.com", hostnames);
      expect(currentEnvService).toEqual("test");
    });

    it("returns undefined if hostname is not found", function() {
      setupMocks("anotherworld.com", hostnames);
      expect(currentEnvService).toBeUndefined();
    });

  });
});