(function () {
    angular.module('gravisim').
        controller('OrderTaskController', ['$scope', '$http', '$location', 'tasks',
            function ($scope, $http, $location, $tasks) {
                var self = this;
                $scope.priority = 2;
                var api = '/api/spark-jobs/';
                $scope.priorities = [
                    low = {
                        "id": 1,
                        "value": "Low"
                    },
                    normal = {
                        "id": 2,
                        "value": "Normal"
                    },
                    high = {
                        "id": 3,
                        "value": "High"
                    },
                    urgent = {
                        "id": 4,
                        "value": "Urgent"
                    }
                ];
                $scope.sendTask = function () {
                    $scope.iterations = $('#iterations').val();
                    $tasks
                        .sendTask($scope.taskData, $scope.filename, $scope.priority, $scope.iterations)
                        .then(function (result) {
                            $scope.loginError = false;
                            $location.path('/task-details').search({ id: result.data.id });

                        }, function (error) {
                            $scope.loginError = true;
                        });
                }
                $(document).ready(function () {
                    $('input#iterations').on('click', function () {
                        var sel = $(this).data('value');
                    });
                });

                $(document).ready(function () {
                    $('#radioBtn span').on('click', function () {
                        var sel = $(this).data('value');
                        var tog = $(this).data('toggle');
                        $scope.priority = sel;
                        // You can change these lines to change classes (Ex. btn-default to btn-danger)
                        $('span[data-toggle="' + tog + '"]').not('[data-value="' + sel + '"]').removeClass('active button-gray').addClass('notActive btn-default');
                        $('span[data-toggle="' + tog + '"][data-value="' + sel + '"]').removeClass('notActive btn-default').addClass('active button-gray');
                        $('#' + tog).val(sel);

                    });
                });

                var updateAvatar = function (event) {
                    var data = new FormData();

                    if (event.target.files) {
                        data.append('file', event.target.files[0]);
                    }

                    $.ajax({
                        url: '/api/upload_data/',
                        type: 'POST',
                        data: data,
                        headers: $tasks.getHeader(),
                        cache: false,
                        enctype: 'multipart/form-data',
                        dataType: 'json',
                        processData: false,
                        contentType: false,
                        success: function (response) {
                            $scope.filename = response.filename;
                            true;
                        },
                        error: function (xhr, err) {
                            console.error(err);
                        },
                    });
                }
                $('input#input-avatar').on('change', updateAvatar);

            }
        ]);

})();