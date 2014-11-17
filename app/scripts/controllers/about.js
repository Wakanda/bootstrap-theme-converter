'use strict';

/**
 * @ngdoc function
 * @name themeBuilderApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the themeBuilderApp
 */
angular.module('themeBuilderApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
