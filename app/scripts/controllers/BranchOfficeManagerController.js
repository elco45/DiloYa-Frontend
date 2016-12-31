angular.module('MyApp.Controllers')
  .controller('BranchManagerController', ['BranchManagerService', '$scope', '$sessionStorage', '$state',
    function (BranchManagerService, $scope, $sessionStorage, $state) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.branchManager = {};
    $scope.branchManagers = [];

    if($state.params.content){
      $scope.prueba = $state.params.content.id_BranchOffice;
      console.log($scope.prueba)
    }

    $scope.allBranchManagers = function(){
      BranchManagerService.All().then(function(response){
        $scope.branchManagers = response.data;
      })
    }

    $scope.getBranchManager = function(data){
      var param = {
        _id: data
      }
      BranchManagerService.Get(param).then(function(response){
        $scope.branchManager = response.data;
      })
    }

    $scope.addBranchManager = function(data){
      var param = {
        name: data.name,
        telephone: data.telephone,
        email: data.email,
        id_BranchOffice: data.id_BranchOffice
      };
      //param id_BranchOffice
      BranchManagerService.Add(param).then(function(response){
        $scope.branchManager = {};
        $scope.branchManagers.push(response.data);
      });
    }

    $scope.deleteBranchManager = function(data){
      BranchManagerService.Delete(data).then(function(response){
        $scope.allBranchManagers();
      })
    }

    $scope.updateBranchManager = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        telephone: data.telephone,
        email: data.email
      };
      BranchManagerService.Update(param).then(function(response){
        $scope.branchManager = {};
        $scope.allBranchManagers();
      })
    }
}]);
