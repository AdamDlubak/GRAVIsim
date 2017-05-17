(function () {
    angular.module('gravisim').
        controller('OrderTaskController', ['$scope', '$http', '$location', 'tasks',
            function ($scope, $http, $location, $tasks) {
                var self = this;

                var api = '/api/spark-jobs/';

                $scope.sendTask = function () {
                    $tasks
                        .sendTask($scope.taskData)
                        .then(function () {
                            $scope.loginError = false;
                            $location.path('/my-dashboard');                            
                        }, function (error) {
                            $scope.loginError = true;
                        });
                }

            }
        ]);

})();