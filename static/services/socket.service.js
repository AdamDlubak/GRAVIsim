(function(){
    "use strict";

    function Socket($location) {
        var _this = this;
        var endpoint = 'ws://' + $location.host() + ':8888';

        _this.ws = null;
        _this.onMessageListeners = [];

        var connect = function(path) {
            var url = endpoint + '/' + path;

            _this.ws = new WebSocket(url);
            _this.ws.onmessage = function(event) {
                _this.onMessageListeners.forEach(function(fn) {
                    fn.call(_this, event);
                });
            };
        };

        var disconnect = function() {
            _this.ws.close();
            _this.ws = null;
        }

        var subscribe = function(fn) {
            _this.onMessageListeners.push(fn);
        };

        var unsubscribe = function(fn) {
            _this.onMessageListeners.splice(_this.onMessageListeners.indexOf(fn), 1);
        };

        return {
            connect: connect,
            subscribe: subscribe,
            unsubscribe: unsubscribe,
            disconnect: disconnect,
        }
    }

    angular.module('utils')
        .factory('socket', ['$location', function($location) {
            return new Socket($location);
        }]);
})();
