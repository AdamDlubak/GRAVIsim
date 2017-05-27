(function(){
    angular.module('gravisim').
        controller('GeneratorController', ['$scope', '$window',
            function($scope, $window) {
                var self = this;

                $scope.tools = [
                    // Point
                    {
                        size: 2,
                        color: {
                            r: 255,
                            g: 255,
                            b: 255,
                        },
                    },
                    // Points cloud
                    {
                        size: 2,
                        cloudSize: 100,
                        quantity: 50,
                        color: {
                            r: 255,
                            g: 255,
                            b: 255,
                        },
                    },
                ];
                $scope.current = 0;
                $scope.elements = [];
                $scope.dataUrl = '#';

                var canvas = $('#generatorCanvas').get()[0];
                var ctx = canvas.getContext('2d');
                var size = 1600;

                function hex(value) {
                    var result = value.toString(16);
                    return (result.length < 2 ? '0' : '') + result; 
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

                    $scope.elements.forEach(function(element) {
                        ctx.fillStyle = '#' + element.colour;
                        ctx.beginPath();
                        ctx.arc(element.x + size / 2, element.y + size / 2,
                                element.mass / 2,
                                0, Math.PI * 2, true);
                        ctx.fill();
                    });
                }

                function generate() {
                    var json = JSON.stringify($scope.elements);
                    var blob = new Blob([json], {type: "application/json"});
                    url = $window.URL || $window.webkitURL;
                    $scope.dataUrl  = url.createObjectURL(blob);
                }

                canvas.addEventListener('click', function(event) {
                    var rect = canvas.getBoundingClientRect();
                    var scale = (rect.right - rect.left) / size;
                    var x = (event.clientX - rect.left) / scale - (size / 2);
                    var y = (event.clientY - rect.top) / scale - (size / 2);
                    var colorRef = $scope.tools[$scope.current].color;
                    var color = hex(colorRef.r) + hex(colorRef.g) + hex(colorRef.b);

                    if ($scope.current == 0) {
                        $scope.elements.push({
                            x: x,
                            y: y,
                            mass: $scope.tools[$scope.current].size,
                            colour: color,
                        });
                    } else if ($scope.current == 1) {
                        for(var i = 0; i < $scope.tools[$scope.current].quantity; i++) {
                            var theta = Math.random() * 2 * Math.PI;
                            var R = Math.random() * ($scope.tools[$scope.current].cloudSize / 2);

                            $scope.elements.push({
                                x: x + R * Math.cos(theta),
                                y: y + R * Math.sin(theta),
                                mass: $scope.tools[$scope.current].size,
                                colour: color,
                            });
                        }
                    }

                    generate();
                    draw();
                    $scope.$digest();
                }, false);

                draw();
            }
        ]);
})();
