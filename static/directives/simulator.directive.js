(function(){    
    angular.module("gravisim").
        directive("simulator", ['$window', '$location', '$http',
            function($window, $location, $http){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/simulator.html',
                    link: function(scope, element, attrs, controller) {
                        var canvas = element.find('canvas').get()[0];
                        var ctx = canvas.getContext('2d');

                        function draw(frame) {
                            ctx.clearRect(0, 0, 640, 480);
                            ctx.fillStyle = 'rgb(255, 255, 255)';

                            var timeline = scope.data.timeline[frame];
                            timeline.forEach(function(position, index) {
                                ctx.beginPath();
                                ctx.arc(position[0] + 320, position[1] + 240,
                                        scope.data.particles[index].mass / 2,
                                        0, Math.PI * 2, true);
                                ctx.fill();
                            });
                        }

                        var data = '/static/media/test-simulator.json';
                        $http.get(data).then(
                            function(result){
                                scope.data = result.data;
                                draw(0);
                            }, function(error){
                                console.error('Cannot fetch data');
                            }
                        );
                    }
                };
        }]);
})();
