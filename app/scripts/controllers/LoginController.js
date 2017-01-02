angular.module('MyApp.Controllers')
  .controller('LoginController', ['AuthService','BusinessService', '$scope', '$state', '$location','$sessionStorage',
    function (AuthService, BusinessService, $scope, $state, $location, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $state.entered = false;

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
            $scope.entered = false;
            $state.go('login');
        }).catch(function(err){
            
        })
    }

    $scope.login = function(user){
        AuthService.Login(user).then(function(response){
            $sessionStorage.currentUser = response.data;
            if($sessionStorage.currentUser.role == -1){
                $scope.$sessionStorage.currentUser.entered = true;
                $scope.$sessionStorage.params = {};
                $state.go('business');
            }else if($sessionStorage.currentUser.role == 0){
                var param = {
                    _id: $sessionStorage.currentUser.id_Business
                }
                BusinessService.Get(param).then(function(response){
                    if(response.data.active == true){
                        $scope.$sessionStorage.currentUser.entered = true;
                        $state.go('branchOffice');
                    }else{
                        $scope.$sessionStorage.currentUser.entered = false;
                        swal("Espere!","Porfavor pague el servicio para poder continuar con esta aplicación","warning");
                    } 
                })
            }
        }).catch(function(err){
            swal("Error!","Correo o contraseña mal ingresado!","error");
        });
    }

    $scope.redirect = function(){
        if($scope.$sessionStorage.currentUser.role == -1){
            $state.go('business');
        }else if($scope.$sessionStorage.currentUser.role == 0){
            $state.go('branchOffice');
        }
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
