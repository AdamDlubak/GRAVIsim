(function() {
    angular.module("gravisim").
        directive("generatorInput", function() {
                return {
                    restrict: 'E',
                    scope: {
                        name: '=name',
                        min: '=min',
                        max: '=max',
                        curvalue: '=curvalue',
                    },
                    templateUrl: '/static/fragments/forms/range-input.html',
                };
            })
})();

