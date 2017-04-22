(function(){    
    angular.module("gravisim").
        directive("logger", ['$window', '$location', '$http', 'socket',
            function($window, $location, $http, $socket){
                return {
                    restrict: 'E',
                    scope: {
                        target: '=',
                    },
                    templateUrl: '/static/fragments/logger.html',
                    link: function($scope, $element, $attrs) {
                        $scope.log = ['Progress: 0'];

                        $socket.connect($scope.target);
                        $socket.subscribe(function(ev) {
                            var record = String(ev.data);

                            if (!(/^\s*$/.test(record))) {
                                if (/Progress/.test(record)) {
                                    $scope.log.splice(-1, 1, record);
                                } else {
                                    $scope.log.push(record);
                                }
                                $scope.$digest();
                            }
                        });
                    }
                };
        }]);
})();
