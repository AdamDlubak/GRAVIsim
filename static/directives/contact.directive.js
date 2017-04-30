(function(){    
    angular.module("gravisim").
        directive("contactform", [function(){
                return {
                    restrict: 'E',
                    scope: {},
                    templateUrl: '/static/fragments/forms/contact-form.html',
                };
        }])
})();
