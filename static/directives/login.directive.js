(function(){    
    angular.module("gravisim").
        directive("login", ['$window', '$location', '$http',
            function($window, $location, $http){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/login.html',

                    link: function($scope, $element, $attrs){

                        $scope.isActive = function (viewLocation) { 
                            return viewLocation === $location.path();
                        };
                    }
                };
        }])
        .directive("modal", ['$window', '$location', '$http',
            function($window, $location, $http){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/modal.html',

                    link: function($scope, $element, $attrs){

                        $scope.isActive = function (viewLocation) { 
                            return viewLocation === $location.path();
                        };
                    }
                };
        }]);
})();
