(function() {
    angular.module('gravisim', [
        'ngRoute', 
        'ui.bootstrap',
    ]).
    config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');
        $locationProvider.html5Mode(true);

        $routeProvider.
        when('/', {
            templateUrl: 'static/fragments/home.html',
        }).
        when('/about', {
            templateUrl: 'static/fragments/about.html',
        }).
        when('/simulate', {
            templateUrl: 'static/fragments/simulate.html',
        }).
        when('/homepage', {
            templateUrl: 'static/fragments/homepage.html',
        }).
        when('/contact', {
            templateUrl: 'static/fragments/contact.html',
        }).
        otherwise({
            redirectTo: '/'
        });
    }]);
})();