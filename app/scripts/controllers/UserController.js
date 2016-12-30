angular.module('MyApp.Controllers')
  .controller('UserController', ['UserService', '$scope', '$state', '$sessionStorage',
    function (UserService, $scope, $state, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.user = {};
    $scope.users = [];
    $scope.roles = [{id:0, description: 'Business Admin'},{id:-1, description: 'Super Admin'}]

    $scope.allUsers = function(){
      UserService.All().then(function(response){
        $scope.users = response.data;
      })
    }

    $scope.getUser = function(data){
      var param = {
        _id: data
      }
      UserService.Get(param).then(function(response){
        $scope.user = response.data;
      })
    }

    $scope.addUser = function(data){
      var param = {
        name: data.name,
        email: data.email,
        telephone: data.telephone,
        password: data.password,
        id_Business: data.id_Business,
        role: data.role
      };
      UserService.Add(param).then(function(response){
        $scope.user = {};
        $scope.users.push(response.data);
      }).catch(function(err){
        swal("Error", "No se puede repetir el mismo correo", "error");
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
        telephone: data.telephone,
        password: data.password,
        id_Business: data.id_Business,
        role: data.role
      };
      UserService.Update(param).then(function(response){
        $scope.user = {};
        $scope.allUsers();
      })
    }
}]);
