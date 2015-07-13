var myApp = angular.module('myApp', []);

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {

  // Determine whether we have an access token, and get one if we don't

  var currentURL = window.location.href;
  var startOfToken = currentURL.indexOf('access_token=');
  var AccessToken = "";

  $scope.tokenGetter = function() {

    // have access token
    if (startOfToken > 0) {
        startOfToken += 13;
        var endOfToken = currentURL.indexOf('&token_type');
        AccessToken = currentURL.substring(startOfToken, endOfToken);
        $http.defaults.headers.get = { 'Authorization' : 'Bearer ' + AccessToken };

    // authorization failed
    } else if (currentURL.indexOf('error') > 0) {
      window.location.assign('https://students.washington.edu/eduardrg/info343/spotify-challenge/index.html');

    // need access token
    } else {
      if (confirm('You must sign in to Spotify to continue.')) {
        var CLIENT_ID = 'fa96e83e7cfd46759a5179a204181039';
        var successURL = 'https://students.washington.edu/eduardrg/info343/spotify-challenge/index.html';
        var scopes = encodeURIComponent('playlist-read-private playlist-read-collaborative');
        window.location.assign('https://accounts.spotify.com/authorize' +
            '?response_type=token' + '&client_id=' + CLIENT_ID + '&scope='
            + scopes + '&redirect_uri=' + successURL);
      }
    }

  };

  $scope.haveToken = function() {
    return AccessToken != "";
  };

  // Get an array of the popularity of each track in a specified playlist, then average them
  var rating = 0;
  $scope.result = "";

  $scope.getTrackPopularities = function() {

      // Convert a playlist url of the form:
      //  https://play.spotify.com/user/{user_id}/playlist/{playlist_id}
      // into an API url of the form:
      //  https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}

      var APIurl = $scope.playlistURL.replace(/play/i, 'api');
      APIurl = APIurl.replace(/.com\/user\//i, '.com/v1/users/');
      APIurl = APIurl.replace(/playlist/i, 'playlists');
      
      // Get playlist name
      $http.get(APIurl + '?fields=name').
        success(function(response) {
          $scope.playlistName = response.name;
        }). 
        error(function() {
          confirm('Error retrieving data.');
        });

      // Average the popularities
      $http.get(APIurl + '/tracks?fields=items(track(popularity)),limit=1000').
        success(function(response) {
          for (i = 0; i < response.items.length; i++) {
            rating += response.items[i].track.popularity;
          }
          rating = Math.round10(rating / response.items.length);
          
          if (rating > 50) {
            $scope.result = rating + "% : You are a pop culture slave.";
          } else {
            $scope.result = rating + "% : You have some hipster cred.";
          }
        }). 
        error(function() {
          confirm('Error retrieving data.');
        });
  };

});