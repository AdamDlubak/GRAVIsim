(function(){    
    angular.module("gravisim").
        directive("simulationresult", [function(){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/demo-canvas.html',
                };
        }])
})();
