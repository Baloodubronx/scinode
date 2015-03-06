'use strict';

angular.module('scinodeApp')
.config(function ($stateProvider) {
  $stateProvider
    .state('wl', {
      url: '/wl',
      templateUrl: 'app/keywords/wl/wl.html',
      controller: 'WlCtrl'
    });
})
.controller( 'WlCtrl', function wlCtrl($scope, $http) {
  $scope.whitelist = [];

  $scope.reload = function() {
    $scope.getWhitelist();
  };

  $scope.getWhitelist = function() {
    $http.get('api/whitelist').success(function(data){
      $scope.whitelist = data;
    });
  };

  $scope.removeFromWhitelist = function(keyword) {
    $http.remove('api/whitelist', {keyword:keyword}).success(function() {
      $scope.reload();
    });
  };


  $scope.reload();

});
