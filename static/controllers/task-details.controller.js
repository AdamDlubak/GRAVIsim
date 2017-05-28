(function () {
    angular.module('gravisim').
        controller('TaskDetailsController', ['$scope', '$http', '$location', 'tasks',
            function ($scope, $http, $location, $tasks) {
                var self = this;

                // These abominations should NOT be here
                // (assignation to undeclared var inside array)
                $scope.status = [
                    waiting = {
                        "id": 0,
                        "value": "Waiting",
                        "color": "#f9a702",
                        "stateButtonLabel": "Suspend job",
                    },
                    running = {
                        "id": 1,
                        "value": "Running",
                        "color": "#008eb2",
                        "stateButtonLabel": "Cannot change running job",
                    },
                    completed = {
                        "id": 2,
                        "value": "Completed",
                        "color": "#0a8429",
                        "stateButtonLabel": "Cannot change completed job",
                    },
                    suspended = {
                        "id": 3,
                        "value": "Suspended",
                        "color": "#c10773",
                        "stateButtonLabel": "Start job",
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

                $scope.stateButtonClass = function() {
                    if ($scope.task && $scope.task.state === waiting.value) {
                        return 'button-suspended-state';
                    } else if ($scope.task && $scope.task.state === suspended.value) {
                        return 'button-run-state';
                    } else {
                        return 'button-gray disabled';
                    }
                }
                
                $scope.fetchData = function () {
                    var api = '/api/spark-jobs/' + $scope.id + '/';

                    $http.get(api).
                        then(function (result) {
                            $scope.task = result.data;
                            for (i = 0; i < 4; i++) {
                                if ($scope.task.state == i) {
                                    $scope.task.state = $scope.status[i].value;
                                    $scope.stateButtonLabel = $scope.status[i].stateButtonLabel;
                                }
                                if ($scope.task.priority == i + 1) $scope.task.priority = $scope.priorities[i].value;
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
                            $scope.$broadcast('dataFetched', $scope.task.id);
                        });
                }, function (error) {
                    console.log(error);
                };

                $scope.fetchData();

                $scope.changeState = function () {
                    var url = '/api/spark-jobs/' + $scope.id + '/';
                    var newState;

                    if ($scope.task.state === waiting.value) { newState = suspended.id; }
                    else if ($scope.task.state === suspended.value) { newState = waiting.id; }
                    else { return; }

                    $tasks
                        .sendTaskStatus( url, $scope.task, newState)
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
