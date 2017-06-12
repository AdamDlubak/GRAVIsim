/**
 * File: tasks.service.js
 */

(function () {
    "use strict";

    var tasks = function ($window, $q, $http, $rootScope, $authentication) {
        var user = null;
        var is_authenticated = false;

        var getToken = function () {
            return $window.localStorage['gravisim-tool-token'];
        };

        var getTokenData = function () {
            var token = getToken();
            return token ? JSON.parse($window.atob(token.split('.')[1])) : null;
        };

        var saveToken = function (newToken) {
            $window.localStorage['gravisim-tool-token'] = newToken;
        };

        var isAuthenticated = function () {
            return is_authenticated;
        };

        var getHeader = function () {
            var token = getToken();
            return token ? {
                "Authorization": "JWT " + token
            } : {};
        };

        (function (token) {
            if (token) {
                var tuser = JSON.parse($window.atob(token.split('.')[1]));
                if (tuser) {
                    if (new Date() >= new Date(tuser.exp * 1000)) {
                        logout();
                        console.log("Session Expired!");
                    } else {
                        is_authenticated = true;
                        $http.get('/api/users/' + tuser.user_id + '/').then(
                            function (data) {
                                user = data.data;
                            }
                        );
                    }
                }
            }
        })(getToken());

        var sendTask = function (data, filename, priorities, iterations, userid) {
            return $q(function (resolve, reject) {
                $http.post(
                    '/api/spark-jobs/',
                    $.param({
                        name: data.name,
                        description: data.description,
                        inputFile: filename,
                        iterations: iterations,
                        priority: priorities,
                    }),
                    {headers: $authentication.getHeader()}
                ).then(function (task) {
                    resolve(task);
                }, function (error) {
                    reject(error);
                });
            });
        }

        var sendTaskStatus = function (url, task, newStatus) {
            return $q(function (resolve, reject) {
                $http.put(url,
                    $.param({
                        state: newStatus,
                        name: task.name,
                        inputFile: task.inputFile,
                        iterations: task.iterations,
                    }),
                    {headers: $authentication.getHeader()}
                ).then(function (task) {
                    resolve(task);
                }, function (error) {
                    reject(error);
                });
            });
        }
        var editTask = function (url, task) {

            return $q(function (resolve, reject) {
                $http.put(url,
                    $.param({
                        state: task.state,
                        name: task.name,
                        description: task.description,
                        priority: task.priority.id,
                        inputFile: task.inputFile,
                        iterations: task.iterations,
                    }),
                    {headers: $authentication.getHeader()}
                ).then(function (task) {
                    resolve(task);
                }, function (error) {
                    reject(error);
                });
            });
        }
        return {
            sendTask: sendTask,
            getToken: getToken,
            saveToken: saveToken,
            getTokenData: getTokenData,
            isAuthenticated: isAuthenticated,
            getHeader: getHeader,
            sendTaskStatus: sendTaskStatus,
            editTask: editTask,
        };
    };

    angular.module('utils').factory('tasks', ['$window', '$q', '$http', '$rootScope', 'authentication', 
        function ($window, $q, $http, $rootScope, $authentication) {
            return new tasks($window, $q, $http, $rootScope, $authentication);
        }
    ]);
})();
