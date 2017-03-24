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
                        var url = '/static/media/test-simulator.json';
                        var size = 1600;

                        scope.fps = 25;
                        scope.pause = true;
                        scope.maxFrame = 0;

                        function startRender() {
                            scope.pause = false;
                            render(0);
                        }

                        function render(frame) {
                            draw(frame);

                            if (!scope.pause) {
                                var delay = 1000 / scope.fps;
                                setTimeout(function() {
                                    var nextFrame = frame + 1 < scope.data.timeline.length ? frame + 1 : 0;
                                    render(nextFrame);
                                }, delay);
                            }
                        }

                        function draw(frame) {
                            ctx.clearRect(0, 0, size, size);
                            ctx.strokeStyle = 'rgb(0, 200, 0)';
                            ctx.lineWidth = 1;

                            ctx.beginPath();
                            ctx.moveTo(0, size / 2);
                            ctx.lineTo(size, size / 2);
                            ctx.stroke();

                            ctx.beginPath();
                            ctx.moveTo(size / 2, 0);
                            ctx.lineTo(size / 2, size);
                            ctx.stroke();

                            ctx.fillStyle = 'rgb(255, 255, 255)';

                            var timeline = scope.data.timeline[frame];
                            timeline.forEach(function(position, index) {
                                ctx.beginPath();
                                ctx.arc(position[0] + size / 2, position[1] + size / 2,
                                        scope.data.particles[index].mass / 2,
                                        0, Math.PI * 2, true);
                                ctx.fill();
                            });
                        }

                        $http.get(url).then(
                            function(result){
                                scope.data = result.data;
                                startRender();
                            }, function(error){
                                console.error('Cannot fetch data');
                            }
                        );
                    }
                };
        }]);
})();
