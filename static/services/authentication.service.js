/**
 * File: authentication.service.js
 */

(function () {
    "use strict";

    var authentication = function ($window, $q, $http, $rootScope) {
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

        var getUser = function () {
            return user;
        };
        var isAdmin = function () {
            return user.is_staff;
        }

        var isAuthenticated = function () {
            return is_authenticated;
        };

        var deleteUser = function (id) {
            return $q(function (resolve, reject) {
                var token = getToken();

                var url = '/api/users/' + id + '/';
                $http.delete(url, {
                    headers: {
                        "Authorization": token
                    }
                    }).then(function () {
                        //
                    }, function (error) {
                        reject(error);
                    });
            });
        }
        var register = function (data) {
            return $q(function (resolve, reject) {
                if (data.password !== data.password2) {
                    reject({
                        password2: "Password is not the same",
                    });
                    return;
                }

                $http.post(
                    '/api/users/',
                    $.param({
                        email: data.email,
                        password: data.password,
                        first_name: data.firstName,
                        last_name: data.lastName,
                        username: data.username,
                        is_superuser: data.isAdmin
                    })
                ).then(function (user) {
                    resolve(user);
                }, function (error) {
                    reject(error);
                });
            });
        }

        var fetchUser = function () {
            return $q(function (resolve, reject) {
                var token = getTokenData();
                var url = '/api/users/' + token.user_id + '/';
                $http.get(url).then(
                    function (data) {
                        user = data.data;
                        $rootScope.$broadcast('user-data-updated');
                        resolve(user);
                    }, function (error) {
                        user = null;
                        $rootScope.$broadcast('user-data-updated');
                        reject(error);
                    }
                );
            });
        };

        var login = function (email, password) {
            return $q(
                function (resolve, reject) {
                    $http.post(
                        '/api-token-auth/',
                        $.param({
                            'username': email,
                            'password': password,
                        })
                    ).then(function (result) {
                        saveToken(result.data.token);
                        is_authenticated = true;
                        fetchUser().then(resolve, reject);
                    }, function (error) {
                        reject(error);
                    });
                });
        };

        var logout = function () {
            $window.localStorage.removeItem('gravisim-tool-token');
            user = null;
            is_authenticated = false;
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
        var editUser = function (url, data) {

            return $q(function (resolve, reject) {
                var token = getTokenData();
                var url = '/api/users/' + token.user_id + '/';
                $http.put(url,
                    $.param({
                        email: data.email,
                        first_name: data.first_name,
                        last_name: data.last_name,
                        username: data.username,
                        is_superuser: data.isAdmin
                    })
                ).then(function (task) {
                    resolve(task);
                }, function (error) {
                    reject(error);
                });
            });
        }
        return {
            login: login,
            register: register,
            deleteUser: deleteUser,
            editUser: editUser,
            logout: logout,
            getToken: getToken,
            getTokenData: getTokenData,
            getUser: getUser,
            fetchUser: fetchUser,
            isAuthenticated: isAuthenticated,
            getHeader: getHeader,
        };
    };

    angular.module('utils').factory('authentication', ['$window', '$q', '$http', '$rootScope',
        function ($window, $q, $http, $rootScope) {
            return new authentication($window, $q, $http, $rootScope);
        }
    ]);
})();
