(function () {
    angular.module('gravisim').
        controller('CompletedTasksController', ['$scope', '$http', '$location', 'authentication',
            function ($scope, $http, $location, $authentication) {
                var self = this;
                $scope.user = $.extend({}, $authentication.getUser());

                var state = 2;
                var choosen = [
                    false,
                    false,
                    true,
                    false
                ]
                $scope.priorities = [
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

                $(document).ready(function () {
                    $('#radioBtn span').on('click', function () {
                        var tog = $(this).data('toggle');
                        // You can change these lines to change classes (Ex. btn-default to btn-danger)
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

                $scope.fetchData = function () {


//!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! Do zmiany na wyszukiwanie dla usera!
                    var api = '/api/spark-jobs/';
                    //var api = '/api/spark-jobs/?author=' + $scope.user.id;

                    $http.get(api).
                        then(function (result) {
                            $scope.users = result.data;
                            $scope.results = [];


                            for (i = 0; i < 4; i++) {
                                if (choosen[i]) {
                                    ($scope.users.filter(job => job.state == i)).forEach(function (elem) {
                                        elem.state = $scope.priorities[i].value;
                                        $scope.results.push(elem)
                                    });
                                }
                            }

                        }, function (error) {
                            console.log(error);
                        });
                };
                $scope.fetchData();






            }
        ]);

})();
