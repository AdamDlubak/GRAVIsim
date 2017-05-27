(function(){
    "use strict";

    var endpoint = 'ws://localhost:8888';

    function Socket() {
        var _this = this;

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
        }
    }

    angular.module('utils')
        .factory('socket', function() {
            return new Socket();
        });
})();
