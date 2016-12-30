angular.module('MyApp.Controllers')
  .controller('BranchManagerLevelTwoController', ['BranchManagerLevelTwoService', '$scope', '$state', 
    function (BranchManagerLevelTwoService, $scope, $state) {
    $scope.branchManagerLevelTwo = {};
    $scope.branchManagersLevelTwo = [];

    $scope.allBranchManagersLevelTwo = function(){
      BranchManagerLevelTwoService.All().then(function(response){
        $scope.branchManagersLevelTwo = response.data;
      })
    }

    $scope.getBranchManagerLevelTwo = function(data){
      var param = {
        _id: data
      }
      BranchManagerLevelTwoService.Get(param).then(function(response){
        $scope.branchManagerLevelTwo = response.data;
      })
    }

    $scope.addBranchManagerLevelTwo = function(data){
      var param = {
        name: data.name,
        telephone: data.telephone,
        email: data.email,
        id_Business: data.id_Business
      };
      //user id_Business
      BranchManagerLevelTwoService.Add(param).then(function(response){
        $scope.branchManagerLevelTwo = {};
        $scope.branchManagersLevelTwo.push(response.data);
      });
    }

    $scope.deleteBranchManagerLevelTwo = function(data){
      BranchManagerLevelTwoService.Delete(data).then(function(response){
        $scope.allBranchManagersLevelTwo();
      })
    }

    $scope.updateBranchManagerLevelTwo = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        telephone: data.telephone,
        email: data.email
      };
      BranchManagerLevelTwoService.Update(param).then(function(response){
        $scope.branchManagerLevelTwo = {};
        $scope.allBranchManagersLevelTwo();
      })
    }
}]);
