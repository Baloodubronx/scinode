'use strict';

angular.module('scinodeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('home', {
        url: '/',
        templateUrl: 'app/home/home.html',
        controller: 'HomeCtrl'
      })
      .state('blacklist', {
        url: '/bl',
        templateUrl: 'app/home/bl.html',
        controller: 'HomeCtrl'
      });
  });
