(function(){    
    angular.module("gravisim").
        directive("editprofile", [function(){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/forms/edit-my-profile.html',
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
