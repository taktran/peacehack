'use strict';

describe('colorHelper', function() {
  var colorHelper;

  beforeEach(angular.mock.module('app'));

  beforeEach(inject(function(_colorHelper_) {
    colorHelper = _colorHelper_;
  }));

  describe("objectToRGB()", function() {
    it('returns the correct color', function() {
      expect(colorHelper.objectToRGB({
        r: 1,
        g: 2,
        b: 3
      })).toBe("rgb(1, 2, 3)");
    });
  });

  describe("rgbToObject()", function() {
    it('returns the correct color', function() {
      var val = colorHelper.rgbToObject("rgb(1, 2, 3)");

      expect(val.r).toBe(1);
      expect(val.g).toBe(2);
      expect(val.b).toBe(3);
    });
  });
});