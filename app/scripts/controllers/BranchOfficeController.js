angular.module('MyApp.Controllers')
  .controller('BranchOfficeController', ['BranchOfficeService', '$scope', '$sessionStorage', 
    function (BranchOfficeService, $scope, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.branchOffice = {};
    $scope.branchOffices = [];

    $scope.allBranchOffices = function(){
      BranchOfficeService.All().then(function(response){
        $scope.branchOffices = response.data;
      })
    }

    $scope.getBranchOffice = function(data){
      var param = {
        _id: data
      }
      BranchOfficeService.Get(param).then(function(response){
        $scope.branchOffice = response.data;
      })
    }

    $scope.addBranchOffice = function(data){
      var param = {
        name: data.name,
        location: data.location,
        telephone: data.telephone,
        direction: data.direction,
        id_Business: data.id_Business
      };
      //user id_Business
      BranchOfficeService.Add(param).then(function(response){
        $scope.branchOffice = {};
        $scope.branchOffices.push(response.data);
      });
    }

    $scope.deleteBranchOffice = function(data){
      BranchOfficeService.Delete(data).then(function(response){
        $scope.allBranchOffices();
      })
    }

    $scope.updateBranchOffice = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        dateStart: data.dateStart,
        datePayed: data.datePayed,
        telephone: data.telephone,
        email: data.email,
        active: data.active
      };
      BranchOfficeService.Update(param).then(function(response){
        $scope.branchOffice = {};
        $scope.allBranchOffices();
      })
    }
}]);
