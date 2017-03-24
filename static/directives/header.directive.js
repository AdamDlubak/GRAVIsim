(function(){    
    angular.module("gravisim").
        directive("header", ['$window', '$location', '$http',
            function($window, $location, $http){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/header.html',
                    link: function($scope, $element, $attrs){
                        $scope.username = 'admin';

                        $scope.isActive = function (viewLocation) { 
                            return viewLocation === $location.path();
                        };
                    }
                };
        }]);
})();
