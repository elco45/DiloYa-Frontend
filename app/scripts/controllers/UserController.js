angular.module('MyApp.Controllers')
  .controller('UserController', ['UserService', 'BusinessService', '$scope', '$state', '$sessionStorage','$rootScope',
    function (UserService, BusinessService, $scope, $state, $sessionStorage, $rootScope) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.user = {};
    $scope.users = [];
    $scope.roles = [{id:"admin", description: 'Business Admin'},{id:"superAdmin", description: 'Super Admin'}];

    $scope.allUsers = function(){
      if($scope.$sessionStorage.currentUser){
        if($scope.$sessionStorage.currentUser.scope.indexOf('superAdmin') > -1){
          UserService.All().then(function(response){
            $scope.users = response.data;
            for(var i = 0; i < $scope.users.length; i++){
              if($scope.users[i]._id === $sessionStorage.currentUser._id){
                $scope.users.splice(i,1);
              }
            }
            for(var i = 0; i < $scope.users.length; i++){
              
              if($scope.users[i].id_Business){
                var param = {
                  _id: $scope.users[i].id_Business
                };

                BusinessService.Get(param).then(function(response2){
                  for (var j = 0; j < $scope.users.length; j++) {
                    if($scope.users[j].id_Business == response2.data._id){
                      $scope.users[j].businessName = response2.data.name;
                      break;
                    }
                  }
                })
              }
            }
          })
        }else{
          $state.go('branchOffice');
        }
      }else{
        $state.go('home');
      }
    }

    $scope.getUser = function(data){
      var param = {
        _id: data
      }
      UserService.Get(param).then(function(response){
        $scope.user = response.data;
        $scope.user.password = "";
      })
    }

    $scope.addUser = function(data){
      var param = {
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        password: data.password,
        id_Business: data.id_Business,
        scope: [data.role]
      };
      UserService.Add(param).then(function(response){
        $scope.user = {};
        $scope.users.push(response.data);
      }).catch(function(err){
        swal("Error", "Ya existe un usuario con ese correo!", "error");
      });
    }

    $scope.deleteUser = function(data){
      UserService.Delete(data).then(function(response){
        $scope.allUsers();
      })
    }

    $scope.updateUser = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        email: data.email,
        telephone: data.telephone
      };
      UserService.Update(param).then(function(response){
        swal("Exito!","Su información ha sido actualizada!", "success");
      })
    }

    $scope.changePassword = function(data){
      var param = {
        _id: $sessionStorage.currentUser._id,
        password: data.newPassword,
        oldPassword: data.oldPassword
      };
      UserService.ChangePassword(param).then(function(response){
        $scope.tmp = {};
        swal("Exito!","Su contraseña ha sido actualizada!", "success");
      }).catch(function(err){
        swal("Error", "La contraseña vieja que ingreso es incorrecto", "error");
      });
    }

    $scope.modifyUser = function(data){
      var param = {
        id: data._id,
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        password: data.password,
        id_Business: data.id_Business
      };

      UserService.ModifyUser(param).then(function(response){
        $scope.user = {};
        $scope.allUsers();
      }).catch(function(err){
        swal("Error", "Ya existe un usuario con ese correo!", "error");
      });
    }
}]);
