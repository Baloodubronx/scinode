'use strict';

angular.module('scinodeApp')
.controller( 'HomeCtrl', function homeCtrl($scope, $http) {
  $scope.keywords = [];

  $scope.reload = function() {
    $scope.getKeywords();
    $scope.getBlacklist();
    $scope.getWhitelist();
  };

  $scope.getKeywords = function() {
    $http.get('api/keywords').success(function(data){
      $scope.keywords = data;
    });
  };

  $scope.getBlacklist = function() {
    $http.get('api/blacklist').success(function(data){
      $scope.blacklist = data;
    });
  };

  $scope.getWhitelist = function() {
    $http.get('api/keywords/whitelist').success(function(data){
      $scope.whitelist = data;
    });
  };


  $scope.setWhitelist = function(keyword) {
    $http.post('api/keywords/whitelist', {keyword:keyword}).success(function(){
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
