(function(){
    angular.module('gravisim').
        controller('HeaderController', ['$scope', '$http', '$location', 'authentication',
            function($scope, $http, $location, $authentication) {
                var self = this;

               $scope.user = $authentication.getUser();

               $scope.logout = function(){
                            $authentication.logout();
                            window.location.replace("/401");
                        };
            }
        ]);

})();