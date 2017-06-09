(function(){    
    angular.module("gravisim").
        directive("generator", [function(){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/forms/generator-form.html',
                };
        }])
        .directive("changelogin", [function(){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/forms/change-login.html',
                };
        }])
        .directive("changepassword", [function(){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/forms/change-password.html',
                };
        }])
})();
