angular.module('MyApp.Controllers')
  .controller('BusinessController', ['BusinessService', '$scope', '$state', '$filter', '$sessionStorage',
    function (BusinessService, $scope, $state, $filter, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.business = {};
    $scope.businesses = [];

    $scope.allBusinesses = function(){
      if($scope.$sessionStorage.currentUser){
        if($scope.$sessionStorage.currentUser.scope.indexOf('superAdmin') > -1){
          BusinessService.All().then(function(response){
            $scope.businesses = response.data;
          })
        }else{
          $state.go('branchOffice');
        }
      }else{
        $state.go('home');
      }
    }

    $scope.getBusiness = function(data){
      var param = {
        _id: data
      }
      BusinessService.Get(param).then(function(response){
        $scope.business = response.data;
        $scope.business.dateStart = new Date(response.data.dateStart);
        $scope.business.datePayed = new Date(response.data.datePayed);
      })
    }

    $scope.addBusiness = function(data){
      var param = {
        name: data.name,
        dateStart: $filter('date')(new Date(), 'MM/dd/yyyy'),
        datePayed: $filter('date')(new Date(), 'MM/dd/yyyy'),
        telephone: data.telephone,
        email: data.email,
        active: data.active
      };
      BusinessService.Add(param).then(function(response){
        $scope.business = {};
        $scope.businesses.push(response.data);
      });
    }

    $scope.deleteBusiness = function(data){
      BusinessService.Delete(data).then(function(response){
        $scope.allBusinesses();
      })
    }

    $scope.updateBusiness = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        dateStart: data.dateStart,
        datePayed: data.datePayed,
        telephone: data.telephone,
        email: data.email,
        active: data.active
      };
      BusinessService.Update(param).then(function(response){
        $scope.business = {};
        $scope.allBusinesses();
      })
    }

    $scope.viewBranchOffices = function(data){
      $state.go('adminBranchOffice', 
        {content:
          {
            id_Business: data._id,
            businessName: data.name
          }
      })
    }
}]);
