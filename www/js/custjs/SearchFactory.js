angular.module('foursquareSearch.SearchFactory', [])

.factory('SearchFactory', ['$http','$q', 'API', function ($http, $q, API) {
  
  var getVenueData = function (data) {
    var venue = data.venue;
    var name, rating, venueID, ratingColor, reviews, tips, address, category, photos;

    if (venue.id !== undefined) { venueID = venue.id; }
    if (venue.location.address !== undefined && venue.location.country !== undefined) {
      address = venue.location.address + ', ' + venue.location.city + ' ' + venue.location.country;
    }
    if (venue.ratingColor !== undefined) { ratingColor = '#'+venue.ratingColor; }
    if (venue.rating !== undefined) { rating = venue.rating; }
    if (venue.ratingSignals !== undefined) { reviews = venue.ratingSignals + ' reviews'; }
    if (venue.name !== undefined) { name = venue.name; }
    if (venue.categories[0].name !== undefined) { category = venue.categories[0].name; } 
    if (data.tips) { tips = data.tips[0].text; }
    
    if (data !== null) {
      if (venue.photos.groups[0] !== undefined) {
        if (venue.photos.groups[0].items[0] !== undefined && !venue.photos.groups[0].items[0].suffix !== undefined) {
          photos = venue.photos.groups[0].items[0].prefix+'128x128'+venue.photos.groups[0].items[0].suffix;
        }
      }
    } 

    return {
      name: name,
      rating: rating,
      venueID: venueID,
      picture_url: photos,
      ratingColor: ratingColor,
      reviews: reviews,
      tips: tips,
      category: category,
      address: address
    };
  };

  return {
     /**
      * @function getVenues
      * @returns a Promise that eventually resolves to the venues
      */
    getVenues: function (locationStr, searchStr, clientID, clientSecret) {
      /* holds a deferred that can be resolved or rejected whenever an asynchronous operation is done.
       * result of an asynchronic operation - provides a way to get the associated promise instance 
       */   
     
     // get $http via $injector because of circular dependency problem
      $http = $http || $injector.get('$http');

      var deferred = $q.defer(); 
      $http.get(API.searchUrl + "explore/?near="+locationStr+"&query="+searchStr+"&v=20160807&m=foursquare&venuePhotos=1&client_id="+clientID+"&client_secret="+clientSecret)
      //$http.get(url)
        .then(function (response) {
          response.status = 200;
          var venues = [];
          venues = response.data.response.groups[0].items;
          var arr = [];
          if (venues.length > 0) {
            for (var i in venues) {
              if (venues[i] !== undefined ){
              var place = getVenueData(venues[i]);
              arr.push(place);
              }
            }
          } else { venues = []; }
          deferred.resolve({ arr: arr });
        }, function(response, status) {
            if (response.status === 400 ) {
               //location.reload(); bad hack
              console.log('should have logged 400 error already :(');
            }
            return deferred.reject(response);     
        });
       return deferred.promise; // response;
    }
  };
}]);
