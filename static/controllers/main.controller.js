(function() {
    angular.module('gravisim').
        controller('MainController', ['$scope', '$http', '$location', 'authentication',
            function($scope, $http, $location, $authentication) {
                var self = this;
                
                $scope.isAuthenticated = function() {
                    return $authentication.isAuthenticated;
                };
            }
        ]);
})();
