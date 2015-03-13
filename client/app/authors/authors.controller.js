'use strict';

angular.module('scinodeApp')
.controller( 'AuthorsCtrl', function authorsCtrl($scope, $http) {
  $scope.authors = [];

  $scope.reload = function() {
    $scope.getAuthors();
  };

  $scope.getAuthors = function() {
    $http.get('api/authors/year/2014').success(function(data){
      $scope.authors = data;
    });
  };

  $scope.reload();

});
