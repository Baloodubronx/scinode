'use strict';

angular.module('scinodeApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('authors', {
        url: '/authors',
        templateUrl: 'app/authors/authors.html',
        controller: 'AuthorsCtrl'
      })
      ;
  });
