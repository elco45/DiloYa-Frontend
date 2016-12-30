angular.module('MyApp.Controllers')
  .controller('LoginController', ['AuthService', '$scope', '$state', '$location','$sessionStorage',
    function (AuthService, $scope, $state, $location, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;

    $scope.resetForm = function(form) {
        form.$setPristine();
        form.$setUntouched();
    };

    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

    $scope.logout = function(){
        AuthService.Logout().then(function(response){
            $sessionStorage.$reset();
            $state.go('login');
        }).catch(function(err){
            alert(err.data.error + " " + err.data.message);
        })
    }

    $scope.login = function(user){
        AuthService.Login(user).then(function(response){
            $sessionStorage.currentUser = response.data;
            $state.go('business');
        }).catch(function(err){
            alert(err.data.error + " " + err.data.message);
        });
    }

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

app.directive('bsActiveLink', ['$location', function ($location) {
    return {
        restrict: 'A', //use as attribute 
        replace: false,
        link: function (scope, elem) {
            //after the route has changed
            scope.$on("$routeChangeSuccess", function () {
                var hrefs = ['/#' + $location.path(),
                             '#' + $location.path(), //html5: false
                             $location.path()]; //html5: true
                angular.forEach(elem.find('a'), function (a) {
                    a = angular.element(a);
                    if (-1 !== hrefs.indexOf(a.attr('href'))) {
                        a.parent().addClass('active');
                    } else {
                        a.parent().removeClass('active');   
                    };
                });     
            });
        }
    }
}]);
