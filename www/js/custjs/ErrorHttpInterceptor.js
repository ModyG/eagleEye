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