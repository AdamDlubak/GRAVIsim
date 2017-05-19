(function () {
    angular.module('gravisim').
        controller('CompletedTasksController', ['$scope', '$http', '$location', 'authentication',
            function ($scope, $http, $location, $authentication) {
                var self = this;
                var author = $authentication.getUser().id;
                var completedState = 2;
                var api = '/api/spark-jobs/?state=' + completedState +'&&author=' + author;

                $scope.fetchData = function () {
                    $http.get(api).
                        then(function (result) {
                            $scope.users = result.data;
                             $scope.users.forEach(function (element) {
                                 element.state = "Completed";
                             }, this);
                        }, function (error) {
                            console.log(error);
                        });
                };
                $scope.fetchData();






            }
        ]);

})();
