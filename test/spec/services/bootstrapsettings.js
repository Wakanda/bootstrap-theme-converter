'use strict';

describe('Service: bootstrapSettings', function () {

  // load the service's module
  beforeEach(module('themeBuilderApp'));

  // instantiate service
  var bootstrapSettings;
  beforeEach(inject(function (_bootstrapSettings_) {
    bootstrapSettings = _bootstrapSettings_;
  }));

  it('should do something', function () {
    expect(!!bootstrapSettings).toBe(true);
  });

});
