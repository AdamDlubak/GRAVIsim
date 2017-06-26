(function () {
    angular.module('gravisim').
        controller('ManageTasksController', ['$scope', '$http', '$location', 'authentication',
            function ($scope, $http, $location, $authentication) {
                var self = this;
                $scope.user = $.extend({}, $authentication.getUser());

                var state = 2;
                var choosen = [true, true, true, true];

                $scope.waitingTasks = [];
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
                    all = {
                        "id": 4
                    }
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
                $(document).ready(function () {
                    $('#status-selection .all-status').on('click', function () {
                        for (i = 0; i < 4; i++) {
                            choosen[i] = true;
                        }
                        $('.notActive').removeClass('notActive btn-default').addClass('active button-gray');
                    });
                });
                $(document).ready(function () {
                    $('#status-selection span').on('click', function () {
                        var tog = $(this).data('toggle');
                        if (!this.classList.contains("active")) {
                            $('span[data-toggle="' + tog).removeClass('notActive btn-default').addClass('active button-gray');
                        } else {
                            $('span[data-toggle="' + tog).removeClass('active button-gray').addClass('notActive btn-default');
                        }

                        choosen[tog] = !choosen[tog];

                        var status = false;
                        choosen.forEach(function (choise) {
                            if (choise) status = true;
                        });
                        if (!status) {
                            $('span[data-toggle="' + tog).removeClass('notActive btn-default').addClass('active button-gray');
                            choosen[tog] = !choosen[tog];
                        }

                        $scope.fetchData();
                    });
                });

                $scope.getPriorityColor = function (priority) {
                    for (var item in $scope.priorities) {
                        if (priority === $scope.priorities[item].value) {
                            return $scope.priorities[item].color;
                        }
                    }
                    return '#333';
                }
                $scope.setVariables = function (elem) {
                    for (j = 0; j < 4; j++) {
                        if (elem.priority == j + 1)
                            elem.priority = $scope.priorities[j].value;
                    }
                    if (elem.created == null) {
                        elem.createdDate = "-----";
                        elem.createdTime = "";
                    } else {
                        elem.createdDate = moment(elem.created).format('DD.MM.YYYY');
                        elem.createdTime = moment(elem.created).format('HH:mm:ss');
                    }
                    if (elem.started == null) {
                        elem.startedDate = "-----";
                        elem.startedTime = "";
                    } else {
                        elem.startedDate = moment(elem.started).format('DD.MM.YYYY');
                        elem.startedTime = moment(elem.started).format('HH:mm:ss');
                    }
                    if (elem.finished == null) {
                        elem.finishedDate = "-----";
                        elem.finishedTime = "";
                    } else {
                        elem.finishedDate = moment(elem.finished).format('DD.MM.YYYY');
                        elem.finishedTime = moment(elem.finished).format('HH:mm:ss');
                    }
                }
                $scope.getStateColor = function (state) {
                    for (var item in $scope.status) {
                        if (state === $scope.status[item].value) {
                            return $scope.status[item].color;
                        }
                    }
                    return '#333';
                }
                $scope.fetchWaitingTaskData = function () {
                    var api = '/api/spark-jobs/';
                    $http.get(api).
                        then(function (result) {

                            $scope.data = result.data;
                            ($scope.data.filter(job => job.state == 0)).forEach(function (elem) {
                                elem.state = $scope.status[0].value;
                                $scope.setVariables(elem);
                                if (elem.state == $scope.status[0].value) $scope.waitingTasks.push(elem);
                            });


                        }, function (error) {
                            console.log(error);
                        });
                }
                $scope.fetchData = function () {
                    var api = '/api/spark-jobs/';
                $scope.tasks = [];

                    $http.get(api).
                        then(function (result) {
                            $scope.data = result.data;
                            for (i = 0; i < 4; i++) {
                                if (choosen[i]) {
                                    ($scope.data.filter(job => job.state == i)).forEach(function (elem) {
                                        elem.state = $scope.status[i].value;
                                        $scope.setVariables(elem);
                                        $scope.tasks.push(elem)
                                    });
                                }
                            }
                        }, function (error) {
                            console.log(error);
                        });
                };
                $scope.fetchWaitingTaskData();
                $scope.fetchData();
                $scope.isEmpty = function () {
                    if ($scope.tasks.length == 0) return true;
                    else false;
                }
            }
        ]);
})();
