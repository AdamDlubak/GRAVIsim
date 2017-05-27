(function(){    
    angular.module("gravisim").
        directive("logger", ['$window', '$location', '$http', 'socket',
            function($window, $location, $http, $socket){
                return {
                    restrict: 'E',
                    templateUrl: '/static/fragments/logger.html',
                    link: function($scope, $element, $attrs) {
                        var _this = this;

                        $scope.log = [];
                        $scope.progress = {
                            complete: '100%',
                            status: 'Waiting for start',
                            styles: 'progress-bar-info active',
                            labelStyles: 'text-info'
                        };
                        $scope.jobData = {
                            'Method': 'N/A',
                            'Animation duration': 'N/A'
                        };

                        $scope.$on('dataFetched', function(event, id) {
                            $scope.target = id;
                            $socket.connect(id);
                            $socket.subscribe(function(ev) {
                                ev.data
                                    .split('\n')
                                    .forEach(function (line) {
                                        _this.parseLine(line);
                                    });
                                $scope.$digest();
                            });
                        });

                        _this.parseLine = function(line) {
                            var record = _this.parseRecord(line);
                            if (!!record) {
                                var parsed;
                                if (record.error) {
                                    $scope.progress.complete = '100%';
                                    $scope.progress.status = 'Simulation Failed!';
                                    $scope.progress.styles = $scope.progressGetClass(record);
                                    $scope.progress.labelStyles = $scope.getClass(record);
                                } else if (record.data) {
                                    parsed = /^(.+)\:\ (.+)$/.exec(record.line);
                                    $scope.jobData[parsed[1]] = parsed[2];
                                } else if (record.progress) {
                                    parsed = /(([\d\.]+%).+)$/.exec(record.line);
                                    $scope.progress.status = parsed[1];
                                    $scope.progress.complete = parsed[2];
                                } else if (record.status) {
                                    $scope.progress.complete = '100%';
                                    $scope.progress.status = record.line;
                                    $scope.progress.styles = $scope.progressGetClass(record);
                                    $scope.progress.labelStyles = $scope.getClass(record);
                                } else if (record.log) {
                                    $scope.log.push(record);
                                }
                            }
                        };

                        _this.parseRecord = function(data) {
                            var customLogRE = /^\$\[\w*\].*/g;
                            var stageRE = /^\[Stage.*\]$/g;
                            var logWarnRE = /.+\sWARN\s.+/g;
                            var logErrorRE = /.+\sERROR\s.+/g;

                            var record = String(data);
                            if (/^\s*$/.test(record)) {
                                return false;
                            }

                            var parsed = /^\s*(\$\[(\w*)\])?(.+)\s*$/.exec(record);
                            var attr = (parsed[2] || '').split('');
                            var line = parsed[3];

                            return {
                                line: line,
                                data: attr.indexOf('D') !== -1,
                                progress: attr.indexOf('P') !== -1,
                                status: attr.indexOf('X') !== -1,
                                bold: attr.indexOf('B') !== -1,
                                warn: attr.indexOf('W') !== -1 || logWarnRE.test(line),
                                error: attr.indexOf('E') !== -1 || logErrorRE.test(line),
                                success: attr.indexOf('S') !== -1,
                                info: attr.indexOf('I') !== -1,
                                log: !customLogRE.test(line) && !stageRE.test(line)
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
                        };

                        $scope.progressGetClass = function(record) {
                            return {
                                'progress-bar-info active': record.info,
                                'progress-bar-danger': record.error,
                                'progress-bar-success': record.success
                            }
                        }
                    }
                };
        }]);
})();
