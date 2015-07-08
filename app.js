var myApp = angular.module('myApp', []);

var myCtrl = myApp.controller('myCtrl', function($scope, $http) {

  // Determine whether we have an access token, and get one if we don't

  var currentURL = window.location.href;
  var startOfToken = currentURL.indexOf('access_token=');
  var AccessToken;

  // have access token
  if (startOfToken > 0) {
      startOfToken += 13;
      var endOfToken = currentURL.indexOf('&token_type');
      AccessToken = currentURL.substring(startOfToken, endOfToken);

  // authorization failed
  } else if (currentURL.indexOf('error') > 0) {
    window.location.assign('https://students.washington.edu/eduardrg/info343/spotify-challenge/index.html');

  // need access token
  } else {
    var continue = confirm('You must sign in to Spotify to continue.');
    if (continue) {
      getAccess();
    }
  }

  // Get an access token for the user's playlists
  var getAccess = function() {
    var CLIENT_ID = 'fa96e83e7cfd46759a5179a204181039';
    var successURL = currentURL;
    var scopes = encodeURIComponent('playlist-read-private playlist-read-collaborative');
    window.location.assign('https://accounts.spotify.com/authorize' +
        '?response_type=token' + '&client_id=' + CLIENT_ID + '&scope='
        + scopes + '&redirect_uri=' + successURL);
  }

  // Convert a playlist url of the form:
  //  https://play.spotify.com/user/{user_id}/playlist/{playlist_id}
  // into an API url of the form:
  //  https://api.spotify.com/v1/users/{user_id}/playlists/{playlist_id}/tracks
  var APIurl = $scope.playlist-URL.replace(/play/i, 'api');
  APIurl = APIurl.replace(/.com\/user/i, '.com/v1/users/');
  APIurl = APIurl.replace(/playlist/i, 'playlists');
  APIurl = APIurl + '/tracks&fields=items(track.popularity)';

  // Get an array of the popularity of each track in the playlist
  $scope.rating = 0;

  $scope.getTrackPopularities = function() {
    $http.get(APIurl).
      success(function(response){
        $scope.rating = avgPopularity(response)
    });
  }

  // Average the popularities
  var avgPopularity = function(popularities) {
    var sum = 0;
    for (i = 0; i < popularities.length; i++) {
      sum += popularities[i];
    }
    return sum / popularities.length;
  }

});