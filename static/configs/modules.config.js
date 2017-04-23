(function() {
    angular.module('utils', []);

    angular.module('gravisim', [
        'utils',
        'ngRoute',
        'ui.bootstrap',
    ]).
    config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(true);

        $routeProvider.
        when('/', {
            templateUrl: 'static/fragments/home.html',
            controller: 'HomeController',
        }).
        when('/about', {
            templateUrl: 'static/fragments/about.html',
        }).
        when('/simulate', {
            templateUrl: 'static/fragments/simulate.html',
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);
})();