(function(){
    angular.module('gravisim').
        controller('HeaderController', ['$scope', '$http', '$location',
            function($scope, $http, $location) {
                $scope.isActive = function (viewLocation) { 
                    return viewLocation === $location.path();
                };

                $scope.username = 'admin';
            }
        ]);
})();
