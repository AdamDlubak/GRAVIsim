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
                        var _this = this;
                        $scope.log = [];

                        $socket.connect($scope.target);
                        $socket.subscribe(function(ev) {
                            ev.data
                                .split('\n')
                                .forEach(function (item) {
                                    var record = _this.parseRecord(item);
                                    if (!!record) {
                                        if (record.recursive &&
                                            $scope.log.length > 0 &&
                                            $scope.log[$scope.log.length - 1].recursive) {
                                                $scope.log.splice(-1, 1, record);
                                        } else {
                                            $scope.log.push(record);
                                        }
                                    }
                                });
                            $scope.$digest();
                        });

                        _this.parseRecord = function(data) {
                            var record = String(data);
                            if (/^\s*$/.test(record)) {
                                return false;
                            }

                            var parsed = /^\s*(\$\[(\w*)\])?(.+)\s*$/.exec(record);
                            var attr = (parsed[2] || '').split('');
                            var line = parsed[3];

                            return {
                                line: line,
                                recursive: attr.indexOf('R') !== -1,
                                bold: attr.indexOf('B') !== -1,
                                warn: attr.indexOf('W') !== -1,
                                error: attr.indexOf('E') !== -1,
                                success: attr.indexOf('S') !== -1,
                                info: attr.indexOf('I') !== -1
                            }
                        };

                        $scope.getClass = function(record) {
                            return {
                                'bold': record.bold,
                                'text-info': record.info,
                                'text-warning': record.warn,
                                'text-error bold': record.error,
                                'text-success bold': record.success
                            }
                        }
                    }
                };
        }]);
})();
