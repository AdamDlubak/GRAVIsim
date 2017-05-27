(function () {
    angular.module('gravisim').
        controller('TaskDetailsController', ['$scope', '$http', '$location', 'authentication',
            function ($scope, $http, $location, $authentication) {
                var self = this;

                $scope.status = [
                    waiting = {
                        "id": 0,
                        "value": "Waiting",
                        "color": "#f9a702"
                    },
                    running = {
                        "id": 1,
                        "value": "Running",
                        "color": "#008eb2"
                    },
                    completed = {
                        "id": 2,
                        "value": "Completed",
                        "color": "#0a8429"
                    },
                    suspended = {
                        "id": 3,
                        "value": "Suspended",
                        "color": "#c10773"
                    },
                ];
                $scope.priorities = [
                    low = {
                        "id": 1,
                        "value": "Low",
                        "color": "#003d84"
                    },
                    normal = {
                        "id": 2,
                        "value": "Normal",
                        "color": "#008421"
                    },
                    high = {
                        "id": 3,
                        "value": "High",
                        "color": "#e08600"
                    },
                    urgent = {
                        "id": 4,
                        "value": "Urgent",
                        "color": "#840000"
                    }
                ];

                $scope.id = $location.search().id;

                $scope.fetchData = function () {
                    var api = '/api/spark-jobs/' + $scope.id + '/';

                    $http.get(api).
                        then(function (result) {
                            $scope.task = result.data;
                            for (i = 0; i < 4; i++) {
                                if ($scope.task.state == i) $scope.task.state = $scope.status[i].value;
                                if ($scope.task.priority == i + 1) $scope.task.priority =  $scope.priorities[i].value;
                            }
                            if ($scope.task.created == null) {
                                $scope.task.createdDate = "-----";
                                $scope.task.createdTime = "";
                            } else {
                                $scope.task.createdDate = moment($scope.task.created).format('DD.MM.YYYY');
                                $scope.task.createdTime = moment($scope.task.created).format('HH:mm:ss');
                            }
                            if ($scope.task.started == null) {
                                $scope.task.startedDate = "-----";
                                $scope.task.startedTime = "";
                            } else {
                                $scope.task.startedDate = moment($scope.task.started).format('DD.MM.YYYY');
                                $scope.task.startedTime = moment($scope.task.started).format('HH:mm:ss');
                            }
                            if ($scope.task.finished == null) {
                                $scope.task.finishedDate = "-----";
                                $scope.task.finishedTime = "";
                            } else {
                                $scope.task.finishedDate = moment($scope.task.finished).format('DD.MM.YYYY');
                                $scope.task.finishedTime = moment($scope.task.finished).format('HH:mm:ss');
                            }
                        });

                }, function (error) {
                    console.log(error);
                };

                $scope.fetchData();

            }
        ]);
})();
