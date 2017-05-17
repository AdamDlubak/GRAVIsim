/**
 * File: tasks.service.js
 */

(function () {
    "use strict";

    var tasks = function ($window, $q, $http, $rootScope) {

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
                var csrf = '{{ csrf_token }}'; 

        var sendTask = function (data) {
            return $q(function (resolve, reject) {
                $http.post(
                    '/api/spark-jobs/',
                    $.param({
                        name: data.name,
                        description: data.description,
                        inputFile: data.inputFile,
                        iterations: data.iterations,
                        priority: data.priority,
                        csrfmiddlewaretoken: csrf
                    })
                ).then(function (user) {
                    resolve(user);
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
        };
    };

    angular.module('utils').factory('tasks', ['$window', '$q', '$http', '$rootScope',
        function ($window, $q, $http, $rootScope) {
            return new tasks($window, $q, $http, $rootScope);
        }
    ]);
})();
