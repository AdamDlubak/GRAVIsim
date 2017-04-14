(function() {
    angular.module('gravisim').
        controller('AuthController', ['$scope', '$http', '$location', 'authentication',
            function($scope, $http, $location, $authentication) {
                var self = this;
                
                
                
                
                $scope.test = 'testowa zawartosc';



                $scope.loginError = false;
                $scope.registerView = false;
                $scope.changeButtonMsg = 'Create account';

                var resetData = function() {
                    $scope.registerData = {};
                    $scope.loginData = {
                        email: '',
                        password: '',
                    };
                }
                resetData();

                $scope.login = function() {
                    if($scope.loginData.email === '' || $scope.loginData.password === '') {
                        $scope.loginError = true;
                        return;
                    }

                    $authentication
                        .login($scope.loginData.email, $scope.loginData.password)
                        .then(function() {
                            $scope.loginError = false;
                            $location.path('/');
                        }, function(error) {
                            $scope.loginError = true;
                        });
                };

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

                $scope.changeView = function() {
                    $scope.registerView = !$scope.registerView;
                    $scope.changeButtonMsg = $scope.registerView ? 'I already have account' : 'Create account';
                    $scope.loginError = false;
                    resetData();
                }
            }
        ]);
})();