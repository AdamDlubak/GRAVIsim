(function(){
    angular.module('gravisim').
        controller('HomeController', ['$scope', '$http', '$location', 'socket', '$interval',
            function($scope, $http, $location, $socket, $interval) {
                var self = this;

                $scope.log = ['Progress: 0'];
                $socket.onmessage = function(ev) {
                    var record = String(ev.data);

                    if (!(/^\s*$/.test(record))) {
                        if (/Progress/.test(record)) {
                            $scope.log.splice(-1, 1, record);
                        } else {
                            $scope.log.push(record);
                        }
                        $scope.$digest();
                    }
                };
            }
        ]);
})();
