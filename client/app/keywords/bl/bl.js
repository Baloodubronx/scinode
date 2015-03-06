'use strict';

angular.module('scinodeApp')
.config(function ($stateProvider) {
  $stateProvider
    .state('bl', {
      url: '/bl',
      templateUrl: 'app/keywords/bl/bl.html',
      controller: 'BlCtrl'
    });
})
.controller( 'BlCtrl', function BlCtrl($scope, $http) {
  $scope.blacklist = [];

  $scope.reload = function() {
    $scope.getBlacklist();
  };

  $scope.getBlacklist = function() {
    $http.get('api/blacklist').success(function(data){
      $scope.blacklist = data;
    });
  };

  $scope.removeFromBlacklist = function(keyword) {
    $http.delete('api/blacklist', {keyword:keyword}).success(function() {
      $scope.reload();
    });
  };


  $scope.reload();

});
