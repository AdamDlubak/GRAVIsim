(function(){
    angular.module('gravisim').
        controller('SimulateController', ['$scope', '$http', '$location',
            function($scope, $http, $location) {
                var self = this;

                $scope.test = 'testowa zawartosc';
            }
        ]);
})();
