(function(){
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
            templateUrl: 'static/fragments/my-dashboard.html',
            controller: 'AuthController',
            controllerAs: 'home'
        }).
        when('/about', {
            templateUrl: 'static/fragments/about.html',
        }).
        when('/simulate', {
            templateUrl: 'static/fragments/simulate.html',
        }).
        when('/my-account', {
            templateUrl: 'static/fragments/my-account.html',
            controller: 'MyaccountController',
        }).
        when('/my-dashboard', {
            templateUrl: 'static/fragments/my-dashboard.html',
            controller: 'MydashboardController',
        }).
        when('/current-tasks', {
            templateUrl: 'static/fragments/current-tasks.html',

        }).
        when('/completed-tasks', {
            templateUrl: 'static/fragments/completed-tasks.html',

        }).
        when('/order-task-with-file', {
            templateUrl: 'static/fragments/order-task-with-file.html',

        }).
        when('/order-task-manually', {
            templateUrl: 'static/fragments/order-task-manually.html',

        }).
        when('/contact', {
            templateUrl: 'static/fragments/contact.html',
        }).
        when('/401', {
            templateUrl: '/static/fragments/home.html',

        }).
        when('/users', {
            templateUrl: 'static/fragments/users.html',
            controller: 'UsersController',
            controllerAs: 'users'
        }).
        otherwise({
            redirectTo: '/'
                });
        }
    ]).
    run(['$rootScope', '$location', 'authentication',
        function($rootScope, $location, $authentication){
            $rootScope.$on('$routeChangeStart', function(event, next, current){
                if(next.$$route){
                    if(!$authentication.isAuthenticated()) {
                        $location.url('/401');
                    }
                }
                else if(next.$$route){
                    if($authentication.isAuthenticated()) {
                        $location.url('/my-dashboard');
                    }
                }
            });
        }]);
    
})();