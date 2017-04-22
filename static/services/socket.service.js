(function(){
    "use strict";

    var mySocket = new WebSocket("ws://localhost:8888");

    angular.module('utils')
        .factory('socket', function() {
            return mySocket;
        });
})();
