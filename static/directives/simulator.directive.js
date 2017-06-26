(function(){    
    angular.module("gravisim").
        directive("simulator", ['$window', '$location', '$http',
            function($window, $location, $http){
                return {
                    restrict: 'E',
                    scope: {
                        url: '=',
                    },
                    templateUrl: '/static/fragments/simulator.html',
                    link: function(scope, element, attrs, controller) {
                        var canvas = element.find('canvas').get()[0];
                        var ctx = canvas.getContext('2d');
                        var size = 1600;
                        var lastUpdateTimestamp = performance.now();

                        scope.file = '/static/media/output/' + scope.url;
                        scope.factor = 1;
                        scope.pause = true;
                        scope.maxFrame = 0;
                        scope.frame = 0;
                        scope.updateFPS = function() {
                            scope.fps = Math.round(25 * scope.factor);
                        };
                        scope.updateFPS();

                        scope.fullscreen = function () {
                            var element = document.getElementById('simulation-canvas');
                            if (element.requestFullscreen) {
                                element.requestFullscreen();
                            } else if (element.webkitRequestFullscreen) {
                                element.webkitRequestFullscreen();
                            } else if (element.mozRequestFullScreen) {
                                element.mozRequestFullScreen();
                            } else if (element.msRequestFullscreen) {
                                element.msRequestFullscreen();
                            }
                        }

                        scope.changeFrame = function () {
                            scope.pause = true;
                            draw();
                        }

                        scope.changePause = function () {
                            scope.pause = !scope.pause;
                            if (!scope.pause) {
                                lastUpdateTimestamp = performance.now();
                                window.requestAnimationFrame(step);
                            }
                        }

                        function draw() {
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

                            var timeline = scope.data.timeline[scope.frame];
                            timeline.forEach(function(position, index) {
                                ctx.fillStyle = '#' + scope.data.particles[index].colour;
                                ctx.beginPath();
                                ctx.arc(position[0] + size / 2, position[1] + size / 2,
                                        scope.data.particles[index].mass / 2,
                                        0, Math.PI * 2, true);
                                ctx.fill();
                            });
                        }

                        function step(timestamp) {
                            if (scope.pause)
                                return;

                            var duration = timestamp - lastUpdateTimestamp
                            var delay = 1000 / scope.fps;
                            if (duration >= delay) {
                                lastUpdateTimestamp = timestamp;
                                scope.frame += Math.floor(duration / delay);
                                if (scope.frame > scope.maxFrame) {
                                    scope.frame -= (scope.maxFrame + 1);
                                }
                                scope.$digest();
                                draw();
                            }
                            window.requestAnimationFrame(step);
                        }

                        function startRender() {
                            scope.pause = false;
                            window.requestAnimationFrame(step);
                        }

                        $http.get(scope.file).then(
                            function(result){
                                scope.data = result.data;
                                scope.maxFrame = scope.data.timeline.length - 1;
                                startRender();
                            }, function(error){
                                console.error('Cannot fetch data');
                            }
                        );
                    }
                };
        }]);
})();
