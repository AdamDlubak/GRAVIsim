(function(){
    angular.module('gravisim')
    .config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
        $locationProvider.html5Mode(true);
        $routeProvider.
            when('/', {
                templateUrl: 'static/fragments/home.html',
                controller: 'AuthController',
                controllerAs: 'auth',
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
                controllerAs: 'dashboard',
            }).
            when('/current-tasks', {
                templateUrl: 'static/fragments/current-tasks.html',

            }).
            when('/completed-tasks', {
                templateUrl: 'static/fragments/completed-tasks.html',
                controller: 'CompletedTasksController',
                controllerAs: 'completed'
            }).
            when('/order-task', {
                templateUrl: 'static/fragments/order-task.html',

            }).
            when('/order-task-manually', {
                templateUrl: 'static/fragments/order-task-manually.html',

            }).
            when('/contact', {
                templateUrl: 'static/fragments/contact.html',
            }).
            when('/login', {
                templateUrl: '/static/fragments/home.html',
                controller: 'AuthController',
                controllerAs: 'auth',
            }).
            when('/users', {
                templateUrl: 'static/fragments/users.html',
                controller: 'UsersController',
                controllerAs: 'users'
            }).
            when('/demo/logger', {
                templateUrl: 'static/fragments/demo-logger.html',
                controller: 'DemoLoggerController',
            }).
            when('/demo/canvas', {
                templateUrl: 'static/fragments/demo-canvas.html',
                controller: 'DemoCanvasController',
            }).
            otherwise({
                redirectTo: '/'
            });
    }])
    .run(['$rootScope', '$location', 'authentication',
        function($rootScope, $location, $authentication){
            $rootScope.$on('$routeChangeStart', function(event, next, current){
                if(next.$$route){
                    if(!$authentication.isAuthenticated()) {
                        $location.url('/');
                    }
                }
            });
        }]);
})();
