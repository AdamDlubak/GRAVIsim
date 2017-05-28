(function(){
    angular.module('gravisim').
        controller('UsersController', ['$scope', '$http', '$location', 'authentication',
            function($scope, $http, $location, $authentication) {
                var self = this;

                var api = '/api/users/';
                
                $scope.fetchData = function(){
                    $http.get(api, {headers: $authentication.getHeader()}).
                        then(function(result){
                            $scope.users = result.data;
                        }, function(error){
                            console.log(error);
                        });
                };
                $scope.fetchData();


                $scope.hasUsers = function(){
                    return ($scope.users);
                };

                $scope.register = function() {
                    $authentication
                        .register($scope.registerData)
                        .then(function() {
                            $scope.loginError = false;
                        }, function(error) {
                            $scope.loginError = true;
                        });
                }

            }
        ]);

})();