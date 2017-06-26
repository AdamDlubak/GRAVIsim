(function(){
    angular.module('gravisim').
        filter('offset', function() {
            return function(input, start) {
                if($.isArray(input)){
                    start = +start;
                    return input.slice(start);
                }
            };
        }).
        filter('abs', function() {
            return function(value) {
                return Math.abs(value);
            };
        })
        .filter('account', function() {
            return function(value) {
                var result = value.substr(0, 2);
                for(var i = 2; i < 26; i+=4) {
                    result += ' ' + value.substr(i, 4);
                }
                return result;
            }
        });
})();
