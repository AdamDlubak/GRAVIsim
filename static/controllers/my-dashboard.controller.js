(function () {
    angular.module('gravisim').
        controller('MyDashboardController', ['$scope', '$http', '$location', 'authentication', 'tasks',
            function ($scope, $http, $location, $authentication) {
                var self = this;

                $scope.user = $.extend({}, $authentication.getUser());

                $scope.rowLink = function ($taskId) {
                    $location.path('/task-details').search({ id: $taskId });
                };

                $scope.tasks = [];

                $('.btn-toggle').click(function () {
                    $(this).find('.btn').toggleClass('active');

                    if ($(this).find('.button-gray').size() > 0) {
                        $(this).find('.btn').toggleClass('button-gray');
                    }

                    $(this).find('.btn').toggleClass('btn-default');

                });

                $('form').submit(function () {
                    alert($(this["options"]).val());
                    return false;
                });

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

                $scope.getPriorityColor = function (priority) {
                    for (var item in $scope.priorities) {
                        if (priority === $scope.priorities[item].value) {
                            return $scope.priorities[item].color;
                        }
                    }
                    return '#333';
                }

                $scope.getStateColor = function (state) {
                    for (var item in $scope.status) {
                        if (state === $scope.status[item].value) {
                            return $scope.status[item].color;
                        }
                    }
                    return '#333';
                }
                $scope.fetchAllData = function () {
                    var api = '/api/spark-jobs/';

                    $http.get(api).
                        then(function (result) {
                            $scope.data = result.data;
                            $scope.tasksAmt = [0, 0, 0, 0, $scope.data.length]
                            for (i = 0; i < 4; i++) {
                                ($scope.data.filter(job => job.state == i)).forEach(function (elem) {
                                    $scope.tasksAmt[i]++;
                                });
                            }
                        }, function (error) {
                            console.log(error);
                        });
                };
                $scope.fetchData = function () {
                    //var api = '/api/spark-jobs/'; // Do zmiany na wyszukiwanie dla usera ------------------------------------------------------------------------------------
                    var api = '/api/spark-jobs/?author=' + $scope.user.id;

                    $http.get(api).
                        then(function (result) {
                            $scope.data = result.data;
                            $scope.tasksAmt = [0, 0, 0, 0, $scope.data.length];
                            for (i = 0; i < 4; i++) {
                                ($scope.data.filter(job => job.state == i)).forEach(function (elem) {
                                    elem.state = $scope.status[i].value;
                                    $scope.tasksAmt[i]++;
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
                                    if (elem.finished != null && elem.started != null) elem.calculationTime = moment.utc(moment.utc(elem.finished) - moment.utc(elem.started)).format("HH:mm:ss")
                                    else elem.calculationTime = "-----";
                                    $scope.tasks.push(elem)
                                });
                            }
                        }, function (error) {
                            console.log(error);
                        });
                };

                $scope.fetchData();

                $scope.isEmpty = function () {
                    if ($scope.tasks.length == 0) return true;
                    else false;
                }


                $scope.filename = '';

                $scope.submit = function () {

                    var url = '/api/users/' + $scope.user.id + '/';
                    $http.put(url, $.param($scope.user), {
                        headers: $authentication.getHeader(),
                    }).then(
                        function () {
                            $authentication.fetchUser();
                        },
                        function (err) { console.error(err); }
                        );
                }

            }
        ]);

})();