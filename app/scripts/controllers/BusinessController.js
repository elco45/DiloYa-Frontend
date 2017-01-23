angular.module('MyApp.Controllers')
  .controller('BusinessController', ['BusinessService', 'BranchOfficeService','ComplainService','$scope', '$state', '$filter', '$sessionStorage',
    function (BusinessService, BranchOfficeService, ComplainService, $scope, $state, $filter, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.business = {};
    $scope.businesses = [];
    $scope.colores = ['#cce6ff','#0000ff','#ff0000']
    $scope.options = { legend: { display: true } };
    $scope.labels = ["Pendiente", "Resuelto", "No atendido"];
    $scope.information = [];

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

    $scope.getBusinessReport = function(idBusiness){
      var business_id = {
        id_Business: idBusiness
      }
      var cont_pendiente = 0;
      var cont_resuelto = 0;
      var cont_no_resuelto = 0;

      BranchOfficeService.AllBranchOfficesByBusiness(business_id).then(function(response){
        console.log(response.data)
        for (var i = 0; i < response.data.length; i++) {
          var branchOffice_id = {
            id_BranchOffice: response.data[i]
          }
          ComplainService.AllComplainsByBranchOffice(branchOffice_id).then(function(response1){
            for (var i = 0; i < response1.data.length; i++) {
              if(response1.data[i].solved == 0){
                cont_pendiente++;
              }else if(response1.data[i].solved == 1){
                cont_resuelto++;
              }else if(response1.data[i].solved == 2){
                cont_no_resuelto++;
              }
            };
            $scope.information = [cont_pendiente,cont_resuelto,cont_no_resuelto];
          }) 
        };
      })

    }

}]);
