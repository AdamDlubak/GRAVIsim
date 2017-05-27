(function(){    
    angular.module("gravisim").
        directive("header", ['$window', '$location', '$http',
            function($window, $location, $http){
                return {
                    restrict: 'E',
                    scope: { user: "@user"},
                    templateUrl: '/static/fragments/header.html',

                    link: function($scope, $element, $attrs){

                        $scope.isActive = function (viewLocation) { 
                            return viewLocation === $location.path();
                        };
                    }
                };
        }]);
})();
