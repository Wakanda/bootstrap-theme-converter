'use strict';

/**
 * @ngdoc overview
 * @name themeBuilderApp
 * @description
 * # themeBuilderApp
 *
 * Main module of the application.
 */
angular
  .module('themeBuilderApp', [
    'ngResource',
    'ngRoute',
    'ngSanitize'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
