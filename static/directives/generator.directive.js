(function () {
    angular.module("gravisim").
        directive("generator", ['$window', '$location', '$http',
            function ($window, $location, $http) {
                return {
                    restrict: 'E',
                    scope: {
                        min: '0.5',
                        max: '10',
                        step: '0.5',
                        model: 'tools[0].size',
                        value: 'tools[0].size',
                    },
                    templateUrl: '/static/fragments/range-input.html',
                }
            }])
})();