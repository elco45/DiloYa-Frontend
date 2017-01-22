angular.module('MyApp.Controllers')
  .controller('LoginController', ['AuthService','BusinessService','UserService', '$scope', '$state', '$location','$sessionStorage',
    function (AuthService, BusinessService, UserService, $scope, $state, $location, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $state.entered = false;
    $scope.fp = {};

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
            if($sessionStorage.currentUser.scope.indexOf('superAdmin') > -1){
                $scope.$sessionStorage.currentUser.entered = true;
                $scope.$sessionStorage.params = {};
                $state.go('business');
            }else if($sessionStorage.currentUser.scope.indexOf('admin') > -1){
                var param = {
                    _id: $sessionStorage.currentUser.id_Business
                }
                BusinessService.Get(param).then(function(response){
                    if(response.data.active == true){
                        $scope.$sessionStorage.currentUser.entered = true;
                        $scope.$sessionStorage.params = {};
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
        if($scope.$sessionStorage.currentUser.scope.indexOf('superAdmin') > -1){
            $state.go('business');
        }else if($scope.$sessionStorage.currentUser.scope.indexOf('admin') > -1){
            $state.go('branchOffice');
        }
    }

    $scope.goSetting = function(){
        $state.go("setting");
    }

    $scope.goNegocio = function(){
        $state.go("business");
    }

    $scope.goUsuarios = function(){
        $state.go("users");
    }

    $scope.goSucursales = function(){
        $state.go("branchOffice");
    }

    $scope.goGerentesNivel2 = function(){
        $state.go("branchOfficeManagerLevelTwo");
    }

    $scope.resetPassword = function(fp_email){
        var temp = {
            email: fp_email
        }
        UserService.GetByEmail(temp).then(function(response){
            if(response.data != 'ok'){
                console.log(response.data)
                var id_usuario = {
                    id: response.data
                }
                UserService.ResetPassword(id_usuario).then(function(response1){
                    swal({
                        title: "Success",
                        text: "Se ha enviado un mensaje a su correo, porfavor reviselo!",
                        type: "success"
                        confirmButtonText: "Aceptar",
                        closeOnConfirm: true
                    })
                })
            }else{
                swal({
                    title: "Error",
                    text: "El correo que ingreso no existe!",
                    type: "error",
                    confirmButtonText: "Aceptar",
                    closeOnConfirm: true
                },
                function(){
                    $scope.fp = {};
                });
            }
           
        })
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
