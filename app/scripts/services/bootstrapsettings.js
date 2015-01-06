'use strict';

/**
 * @ngdoc service
 * @name themeBuilderApp.bootstrapSettings
 * @description
 * # bootstrapSettings
 * Service in the themeBuilderApp.
 */
angular.module('themeBuilderApp')
	.service('bootstrapSettings', function bootstrapSettings($resource) {
		return $resource('styles/wakanda_starter_theme/config.json');
	});
