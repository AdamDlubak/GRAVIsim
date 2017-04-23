(function(){
    angular.module('gravisim').
        controller('UsersController', ['$scope', '$http', '$location', 'authentication',
            function($scope, $http, $location, $authentication) {
                var self = this;

               $scope.user = $authentication.getUser();



                $scope.register = function() {
                    $authentication
                        .register($scope.registerData)
                        .then(function() {
                            $scope.loginError = false;
                            $authentication
                                .login($scope.registerData.email, $scope.registerData.password)
                                .then(function() {
                                    $location.path('/');
                                });
                        }, function(error) {
                            $scope.loginError = true;
                        });
                }

            }
        ]);

})();