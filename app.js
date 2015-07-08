var myApp = angular.module('myApp', []);

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {
  var tracks;
  var baseUrl = 'https://api.spotify.com/v1/search?type=track&query=';
  $scope.playlist-URL;
  $scope.getTracks = function() {
    $http.get(baseUrl + $scope.track).success(function(response){
      data = $scope.tracks = response.tracks.items
      
    })
  }
  var avgPopularity = function(data) {
    
  }
})