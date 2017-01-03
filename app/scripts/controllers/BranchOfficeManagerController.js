angular.module('MyApp.Controllers')
  .controller('BranchOfficeManagerController', ['BranchOfficeManagerService', '$scope', '$sessionStorage', '$state',
    function (BranchOfficeManagerService, $scope, $sessionStorage, $state) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.branchOfficeManager = {};
    $scope.branchOfficeManagers = [];

    if($state.params.content){
      if($state.params.content.id_Business){
        $scope.$sessionStorage.params.id_Business = $state.params.content.id_Business;
      }
      if($state.params.content.businessName){
        $scope.$sessionStorage.params.businessName = $state.params.content.businessName;
      }
      if($state.params.content.id_BranchOffice){
        $scope.$sessionStorage.params.id_BranchOffice = $state.params.content.id_BranchOffice;
      }
      if($state.params.content.branchOfficeName){
        $scope.$sessionStorage.params.branchOfficeName = $state.params.content.branchOfficeName;
      }
    }

    $scope.allBranchOfficeManagers = function(){

      BranchOfficeManagerService.All().then(function(response){
        $scope.branchOfficeManagers = response.data;
      })
    }

    $scope.getBranchOfficeManager = function(data){
      var param = {
        _id: data
      }
      BranchOfficeManagerService.Get(param).then(function(response){
        $scope.branchOfficeManager = response.data;
      })
    }

    $scope.addBranchOfficeManager = function(data){
      var param = {
        name: data.name,
        telephone: data.telephone,
        email: data.email,
        id_BranchOffice: $scope.$sessionStorage.params.id_BranchOffice
      };
      //param id_BranchOffice
      BranchOfficeManagerService.Add(param).then(function(response){
        $scope.branchOfficeManager = {};
        $scope.branchOfficeManagers.push(response.data);
      });
    }

    $scope.deleteBranchOfficeManager = function(data){
      BranchOfficeManagerService.Delete(data).then(function(response){
        $scope.allBranchOfficeManagersByBranchOffice($scope.$sessionStorage.params.id_BranchOffice);
      })
    }

    $scope.updateBranchOfficeManager = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        telephone: data.telephone,
        email: data.email
      };
      BranchOfficeManagerService.Update(param).then(function(response){
        $scope.branchOfficeManager = {};
        $scope.allBranchOfficeManagersByBranchOffice($scope.$sessionStorage.params.id_BranchOffice);
      })
    }

    $scope.allBranchOfficeManagersByBranchOffice = function(data){
      var param = {
        id_BranchOffice: data
      }
      BranchOfficeManagerService.AllBranchOfficeManagersByBranchOffice(param).then(function(response){
        $scope.branchOfficeManagers = response.data;
      })
    }
}]);
