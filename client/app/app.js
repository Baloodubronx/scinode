// jshint latedef:nofunc
'use strict';

angular
  .module('scinodeApp', [
  'ui.router'
])
  .config(function ($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');
    $locationProvider.html5Mode(true);
  })

  .factory('_', function() {
		return window._; // assumes underscore has already been loaded on the page
	});
