// Ionic foursquareSearch App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('foursquareSearch', ['ionic',
  'geolocation',
  'foursquareSearch.SearchController',
  'foursquareSearch.GeoLocationFactory',
  'foursquareSearch.SearchDetailCtrl',
  'foursquareSearch.API',
  'foursquareSearch.errorHttpInterceptor',
  'foursquareSearch.SearchFactory'])

  .run(function ($ionicPlatform) {

    $ionicPlatform.ready(function () {

      if (window.cordova && window.cordova.plugins.Keyboard) {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

        // Don't remove this line unless you know what you are doing. It stops the viewport
        // from snapping when text inputs are focused. Ionic handles this internally for
        // a much nicer keyboard experience.
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if (window.StatusBar) {
        StatusBar.styleDefault();
      }
    });
  })

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function ($stateProvider, $urlRouterProvider, $httpProvider) {

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
        });

      // if none of the above states are matched, use this as the fallback
      $urlRouterProvider.otherwise('/');

    }]);
