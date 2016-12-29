angular.module('MyApp.Controllers')
  .controller('BusinessController', ['BusinessService', '$scope', '$state', '$filter',
    function (BusinessService, $scope, $state, $filter) {
    $scope.business = {};
    $scope.businesses = [];

    $scope.allBusinesses = function(){
      BusinessService.All().then(function(response){
        $scope.businesses = response.data;
      })
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
}]);
