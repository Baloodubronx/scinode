'use strict';

angular.module('scinodeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('journals', {
        url: '/journals',
        templateUrl: 'app/journals/journals.html',
        controller: 'JournalsCtrl'
      })
      ;
  });
