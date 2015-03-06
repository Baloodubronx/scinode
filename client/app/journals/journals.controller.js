'use strict';

angular.module('scinodeApp')
.controller( 'JournalsCtrl', function journalsCtrl($scope, $http) {
  $scope.keywords = [];

  $scope.reload = function() {
    $scope.getJournals();
  };

  $scope.getJournals = function() {
    $http.get('api/journals/year/2014').success(function(data){
      $scope.journals = data;
    });
  };

  $scope.reload();

});
