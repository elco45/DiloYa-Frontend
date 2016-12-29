angular.module('MyApp.Controllers')
  .controller('LoginController', ['AuthService', '$scope', '$state', 
    function (AuthService, $scope, $state) {

    $scope.resetForm = function(form) {
        form.$setPristine();
        form.$setUntouched();
    };

}]);

//directives
app.directive("limitTo", [function() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
}]);