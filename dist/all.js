// Ionic foursquareSearch App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('foursquareSearch', ['ionic',
               'geolocation',
               'foursquareSearch.SearchController',
               'foursquareSearch.GeoLocationFactory',
               'foursquareSearch.SearchDetailCtrl',
               'foursquareSearch.errorHttpInterceptor',
               'foursquareSearch.SearchFactory'])

.run(function($ionicPlatform) {

  $ionicPlatform.ready(function() {

    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

 .config(['$stateProvider', '$urlRouterProvider','$httpProvider', 
         function($stateProvider, $urlRouterProvider, $httpProvider) {
    
    $httpProvider.interceptors.push('errorHttpInterceptor');

  // Ionic uses AngularUI Router which uses the concept of states
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers

  $stateProvider

  // setup an abstract state for the tabs directive
    .state('search', {
    url: '/',
    templateUrl: 'templates/search.html',
    controller: 'SearchCtrl'
  })

  // Each tab has its own nav history stack:

  .state('search.search-detail', {
      url: '/search/:searchId',
      views: {
        'search-detail': {
         templateUrl: 'templates/search-detail.html',
         controller: 'SearchDetailCtrl'
        }
      }
  })

  .state('search.404', {
      url: '/search/:searchId',
      views: {
        'search-detail': {
         templateUrl: 'templates/404.html',
         controller: '404Ctrl'
        }
      }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/');

}]);

angular.module('foursquareSearch.SearchController', [])

.controller('SearchCtrl', function ($scope, $http, $ionicLoading, $interval, SearchFactory, geolocation, $rootScope, GeoLocationFactory) {
  
  $scope.config = {
    clientID: 'FSHPY2OMORSUOX1UPMF01QO5ADO0SZ1X53SF5VILHAY4YSMS',
    clientSecret: 'YOTIUZLLEFQ3JDM0X3FA1PQYHOZIBRMKJBB4DPZ41WPCGB4A',
    searchStr: '',
    location: '', 
    state: 'isLoading',
    connection:'isConnected'
  };
  //get user location
  $scope.userLocation = function() {
    GeoLocationFactory.getLocation().then(function(data) {   
        if(data) console.log(data);
    });
  };

  //$scope.userLocation();
   
  $scope.doRefresh = function () {
    /*if no data found */
    if ($scope.config.location === '' &&  $scope.config.searchStr === '') {
       $interval(function () {
        $scope.config.state = 'noSearchTerm';
      }, 5000);  
    } 
    
    $interval(function () {
      geolocation.getLocation().then(function (data) {
        $scope.config.coords = { lat: data.coords.latitude, long: data.coords.longitude };
        $scope.coordinates = $scope.config.coords.lat + ',' + $scope.config.coords.long;

          var coords = ($scope.config.location === '' ) ? $scope.coordinates : $scope.config.location;
          if ($scope.config.location === ''  || $scope.config.searchStr  === '' ) return;

          $scope.getVenue = function (locationStr, searchStr, clientID, clientSecret) {
          
          //var URL = "https://api.foursquare.com/v2/venues/explore/?near="+coords+"&query="+$scope.config.searchStr+"&v=20160807&m=foursquare&venuePhotos=1&client_id="+$scope.config.clientID+"&client_secret="+$scope.config.clientSecret;
            SearchFactory.getVenues(coords, $scope.config.searchStr,$scope.config.clientID, $scope.config.clientSecret)
              // then() returns a new promise. We return that new promise.
             // that new promise is resolved via venueData.arr, i.e. the venues
              .then(function (venueData) {
                $scope.config.state = 'loaded';

                if (venueData )
                $scope.venues = venueData.arr;
                
                $scope.config.state = 'loaded';  
                 $ionicLoading.hide(); //hide the loading
                 $scope.$broadcast('scroll.refreshComplete');

                 if ($scope.config.location === '' &&  $scope.config.searchStr === '' || 
                    ($scope.config.location === '' ||  $scope.config.searchStr === '') || $scope.config.location.length <= 3 ) {
                      return $scope.config.state = 'noResult';  
                  }
                }, function(response) {
                      
                    $ionicLoading.hide(); //hide the loading
                    $scope.$broadcast('scroll.refreshComplete');
                    return $scope.config.state = 'notFound';    
              });
          };
          $scope.getVenue();
        });
        
      }, 7000);
  };
  
  $scope.search = function () {
      $scope.config.state = 'loaded';
      $scope.doRefresh();
      $ionicLoading.show();
      $scope.doRefresh();  
  };
  // $scope.$watch('config.searchStr', function () {
  //    $scope.search();
  // });
});

angular.module('foursquareSearch.SearchDetailCtrl', [])

.controller('SearchDetailCtrl', function($scope, $http) {
  $scope.mapClick = function() {
    window.location.href = "http://maps.google.com/maps?z=16&t=m&q=loc:" +
      $scope.lat + "+" + $scope.lng;
  };

  $scope.venueID = navi.getCurrentPage().options.venueID;
  $scope.obj = {
    state: 'loading',
  };

  var clientID = "FSHPY2OMORSUOX1UPMF01QO5ADO0SZ1X53SF5VILHAY4YSMS";
  var clientSecret = "YOTIUZLLEFQ3JDM0X3FA1PQYHOZIBRMKJBB4DPZ41WPCGB4A";


  $http.get(
    "https://api.foursquare.com/v2/venues/" +
    $scope.venueID +
    "?client_id=" + clientID +
    "&client_secret=" + clientSecret +
    "&v=20160807"
  ).then(function(result, status) {

    $scope.obj.state = 'loaded';

    var venue = result.data.response.venue;
    $scope.title = venue.name;
    $scope.imgSrc = venue.bestPhoto.prefix + '300x300' + venue.bestPhoto.suffix;

    $scope.address = venue.location.formattedAddress[0] + ',' + venue.location.formattedAddress[1];
    $scope.openInfo = $scope.getInfo(venue.popular);
    $scope.lat = venue.location.lat;
    $scope.lng = venue.location.lng;
  }, function(data, status) {
    $scope.obj.state = 'noResult';
  });

  $scope.getInfo = function(data) {
    var info = "";
    if (data && data.timeframes) {
      for (var i in data.timeframes[0].open) {
        if (i !== 0) {
          info += '\n';
        }
        info += data.timeframes[0].open[i].renderedTime;
      }
    }

    return info;
  };
});

angular.module('foursquareSearch.errorHttpInterceptor', [])

.factory('errorHttpInterceptor', ['$q', function ($q) {
        return {
            responseError: function responseError(rejection) {
                //console.log(rejection);
                Raven.captureException(new Error('HTTP response error'), {
                    extra: {
                        config: rejection.config,
                        status: rejection.status
                    }
                });
                return $q.reject(rejection);
            }
        };
   }])
angular.module('foursquareSearch.GeoLocationFactory', [])

.factory('GeoLocationFactory', ['$q', '$http', function myCoordinates($q, $http) {
  return {
    getLocation: function() {
      var deferred = $q.defer();

      //Unable to use this currently due to security restrictions
      $http.get('http://ip-api.com/json').success(function (ipAPI) {
        
        var myCoordinates = {};

        myCoordinates.lat = ipAPI.lat;
        myCoordinates.lng = ipAPI.lon;
        myCoordinates.city = ipAPI.city + ', ' + ipAPI.region;
        deferred.resolve(myCoordinates);
      }).error(function(error){
        console.log( 'data not loaded');
      });
      return deferred.promise;
    }
  }  
}])

angular.module('foursquareSearch.SearchFactory', [])

.factory('SearchFactory', ['$http','$q', function ($http, $q) {
  
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
      $http.get("https://api.foursquare.com/v2/venues/explore/?near="+locationStr+"&query="+searchStr+"&v=20160807&m=foursquare&venuePhotos=1&client_id="+clientID+"&client_secret="+clientSecret)
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
