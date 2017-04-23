(function(){
    angular.module('gravisim').
        controller('DemoCanvasController', ['$scope',
            function($scope) {
                var self = this;

                $scope.active = 0;
                $scope.views = ['output.json', 'output2.json'];

                $scope.changeTo = function(index) {
                    $scope.active = index;
                }
            }
        ]);
})();
