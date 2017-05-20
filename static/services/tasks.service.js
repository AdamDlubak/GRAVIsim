/**
 * File: tasks.service.js
 */

(function () {
    "use strict";

    var tasks = function ($window, $q, $http, $rootScope) {
        
        var user = null,
            is_authenticated = false;

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

        var isAuthenticated = function() {
            return is_authenticated;
        };

        var getHeader = function () {
            var token = getToken();
            return token ? {
                "Authorization": "JWT " + token
            } : {};
        };

        (function(token){
            if(token) {
                var tuser = JSON.parse($window.atob(token.split('.')[1]));
                if(tuser) {
                    if(new Date() >= new Date(tuser.exp*1000)){
                        logout();
                        console.log("Session Expired!");
                    } else {
                        is_authenticated = true;
                        $http.get('/api/users/' + tuser.user_id + '/').then(
                            function(data){
                                user = data.data;
                            }
                        );
                    }
                }
            }
        })(getToken());

        var sendTask = function (data, filename, priorities, iterations) {
            return $q(function (resolve, reject) {
                $http.post(
                    '/api/spark-jobs/',
                    $.param({
                        name: data.name,
                        description: data.description,
                        inputFile: filename,
                        iterations: iterations,
                        priority: priorities,
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
            isAuthenticated: isAuthenticated,
            getHeader: getHeader,
        };
    };

    angular.module('utils').factory('tasks', ['$window', '$q', '$http', '$rootScope',
        function ($window, $q, $http, $rootScope) {
            return new tasks($window, $q, $http, $rootScope);
        }
    ]);
})();
