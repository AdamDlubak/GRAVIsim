(function(){
    angular.module('gravisim').
        controller('MyAccountController', ['$scope', '$http', '$location', 'authentication',
            function($scope, $http, $location, $authentication) {
                var self = this;

               $scope.user = $.extend({}, $authentication.getUser());

                $scope.submit = function() {

                    var url = '/api/users/' + $scope.user.id + '/';
                    $http.put(url, $.param($scope.user), {
                        headers: $authentication.getHeader(),
                    }).then(
                        function() {
                            $authentication.fetchUser();
                        },
                        function(err) { console.error(err); }
                    );
                }
            }
        ]);

})();