(function () {
    angular.module('gravisim').
        controller('AuthController', ['$scope', '$http', '$location', 'authentication',
            function ($scope, $http, $location, $authentication) {
                var self = this;

                $scope.isAuthenticated = $authentication.isAuthenticated;

                $scope.loginError = false;
                $scope.deleteError = false;
                $scope.registerView = false;
                $scope.changeButtonMsg = 'Create account';


                var resetData = function () {
                    $scope.registerData = {};
                    $scope.loginData = {
                        email: '',
                        password: '',
                    };
                }
                resetData();

                $scope.login = function () {
                    if ($scope.loginData.email === '' || $scope.loginData.password === '') {
                        $scope.loginError = true;
                        return;
                    }

                    $authentication
                        .login($scope.loginData.email, $scope.loginData.password)
                        .then(function () {
                            $scope.loginError = false;
                            $location.path('/my-dashboard');
                        }, function (error) {
                            $scope.loginError = true;
                        });
                };

                $scope.register = function () {
                    $authentication
                        .register($scope.registerData)
                        .then(function () {
                            $scope.loginError = false;
                        }, function (error) {
                            $scope.loginError = true;
                        });
                }

                $scope.changeView = function () {
                    $scope.registerView = !$scope.registerView;
                    $scope.changeButtonMsg = $scope.registerView ? 'I already have account' : 'Create account';
                    $scope.loginError = false;
                    resetData();
                }

            }
        ]);
})();