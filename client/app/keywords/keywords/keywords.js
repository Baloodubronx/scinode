'use strict';

angular.module('scinodeApp')
.config(function ($stateProvider) {
  $stateProvider
    .state('keywords', {
      url: '/',
      templateUrl: 'app/keywords/keywords/keywords.html',
      controller: 'KeywordsCtrl'
    });
})
.controller( 'KeywordsCtrl', function homeCtrl($scope, $http) {
  $scope.keywords = [];

  $scope.reload = function() {
    $scope.getKeywords();
  };

  $scope.getKeywords = function() {
    $http.get('api/keywords').success(function(data){
      $scope.keywords = data;
    });
  };

  $scope.setWhitelist = function(keyword, count) {
    $http.post('api/whitelist', {keyword:keyword, count:count}).success(function(){
      $scope.reload();
    });
  };

  $scope.remove = function(keyword) {
    $http.post('api/blacklist', {keyword:keyword}).success(function() {
      $scope.reload();
    });
  };


  $scope.reload();

});
