angular.module('MyApp.Controllers')
  .controller('BranchOfficeManagerLevelTwoController', ['BranchOfficeManagerLevelTwoService', '$scope', '$sessionStorage', '$state',
    function (BranchOfficeManagerLevelTwoService, $scope, $sessionStorage, $state) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.branchOfficeManagerLevelTwo = {};
    $scope.branchOfficeManagersLevelTwo = [];

    $scope.allBranchOfficeManagersLevelTwo = function(){
      BranchOfficeManagerLevelTwoService.All().then(function(response){
        $scope.branchOfficeManagersLevelTwo = response.data;
      })
    }

    $scope.getBranchOfficeManagerLevelTwo = function(data){
      var param = {
        _id: data
      }
      BranchOfficeManagerLevelTwoService.Get(param).then(function(response){
        $scope.branchOfficeManagerLevelTwo = response.data;
      })
    }

    $scope.addBranchOfficeManagerLevelTwo = function(data){
      var param = {
        name: data.name,
        telephone: data.telephone,
        email: data.email,
        id_Business: $scope.$sessionStorage.currentUser.id_Business
      };
      //user id_Business
      BranchOfficeManagerLevelTwoService.Add(param).then(function(response){
        $scope.branchOfficeManagerLevelTwo = {};
        $scope.branchOfficeManagersLevelTwo.push(response.data);
      });
    }

    $scope.deleteBranchOfficeManagerLevelTwo = function(data){
      BranchOfficeManagerLevelTwoService.Delete(data).then(function(response){
         $scope.allBranchOfficeManagersLevelTwoByBusiness($sessionStorage.currentUser.id_Business);
      })
    }

    $scope.updateBranchOfficeManagerLevelTwo = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        telephone: data.telephone,
        email: data.email
      };
      BranchOfficeManagerLevelTwoService.Update(param).then(function(response){
        $scope.branchOfficeManagerLevelTwo = {};
        $scope.allBranchOfficeManagersLevelTwoByBusiness($sessionStorage.currentUser.id_Business);
      })
    }

    $scope.allBranchOfficeManagersLevelTwoByBusiness = function(data){
      var param = {
        id_Business: data
      }
      BranchOfficeManagerLevelTwoService.AllBranchOfficeManagersLevelTwoByBusiness(param).then(function(response){
        $scope.branchOfficeManagersLevelTwo = response.data;
      })
    }
}]);
