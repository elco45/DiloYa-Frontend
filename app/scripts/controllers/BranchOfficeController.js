angular.module('MyApp.Controllers')
  .controller('BranchOfficeController', ['BranchOfficeService', 'BranchOfficeManagerService', 'ComplainService','$scope', '$sessionStorage', '$state', '$rootScope',
    function (BranchOfficeService, BranchOfficeManagerService, ComplainService,$scope, $sessionStorage, $state, $rootScope) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.branchOffice = {};
    $scope.branchOffices = [];
    $scope.businessBranchOffices = [];
    $scope.colores = ['#cce6ff','#0000ff','#ff0000']
    $scope.options = { legend: { display: true } };
    $scope.labels = ["Pendiente", "Resuelto", "No atendido"];
    $scope.information = [];

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
      if($state.params.content.bracnhOfficeName){
        $scope.$sessionStorage.params.bracnhOfficeName = $state.params.content.bracnhOfficeName;
      }
    }

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
        id_location: data.id_location,
        coordinates: data.coordinates,
        telephone: data.telephone,
        direction: data.direction,
        id_Business: $scope.$sessionStorage.currentUser.id_Business,
        maxWaitTime: data.maxWaitTime
      };
      //user id_Business
      BranchOfficeService.Add(param).then(function(response){
        $scope.branchOffice = {};
        $scope.businessBranchOffices.push(response.data);
      });
    }

    $scope.deleteBranchOffice = function(data){
      var param = {
        id_BranchOffice: data
      }
      BranchOfficeManagerService.AllBranchOfficeManagersByBranchOffice(param).then(function(response){
        for(var i = 0; i<response.data.length; i++){
          BranchOfficeManagerService.Delete(response.data[i]._id).then(function(response){
          })
        }
        BranchOfficeService.Delete(data).then(function(response){
          $scope.allBranchOfficesByBusiness($scope.$sessionStorage.currentUser.id_Business)
        })
      })
    }

    $scope.updateBranchOffice = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        id_location: data.id_location,
        coordinates: data.coordinates,
        telephone: data.telephone,
        direction: data.direction,
        maxWaitTime: data.maxWaitTime
      };
      BranchOfficeService.Update(param).then(function(response){
        $scope.branchOffice = {};
        $scope.allBranchOfficesByBusiness($scope.$sessionStorage.currentUser.id_Business)
      })
    }

    $scope.allBranchOfficesByBusiness = function(data){
      var param = {
        id_Business: data
      }
      BranchOfficeService.AllBranchOfficesByBusiness(param).then(function(response){
        $scope.businessBranchOffices = response.data;
      })
    }

    if($sessionStorage.currentUser.scope.indexOf('admin') > -1){
      var map2 = new google.maps.Map(document.getElementById('map2'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 17
      });
      $scope.initMap2 = function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            $scope.branchOffice.coordinates = JSON.stringify(pos);
            $scope.$apply()
            var marker = new google.maps.Marker({
                position: pos,
                title:"Hello World!"
            });
            
            // To add the marker to the map, call setMap();
            marker.setMap(map2);
            map2.setCenter(pos);
          });
        } else {
          alert('browser not supported!')
        }    
      }

      $(function() {
        $('#myModalAdd').on('shown.bs.modal', function () {
          var center=map2.getCenter();
          google.maps.event.trigger(map2, "resize");
          map2.setCenter(center);
        });
      });

      var map3 = new google.maps.Map(document.getElementById('map3'), {
        center: {lat: -33.8688, lng: 151.2195},
        zoom: 17
      });
      $scope.initMap3 = function() {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            $scope.branchOffice.coordinates = JSON.stringify(pos);
            $scope.$apply()
            var marker = new google.maps.Marker({
                position: pos,
                title:"Hello World"
            });
           
            // To add the marker to the map, call setMap();
            marker.setMap(map3);
            map3.setCenter(pos);
          });
        } else {
          alert('browser not supported!')
        }    
      }

      $(function() {
        $('#myModalEdit').on('shown.bs.modal', function () {
          var center=map3.getCenter();
          google.maps.event.trigger(map3, "resize");
          map3.setCenter(center);
        });
      });

    }

    $scope.viewBranchOfficeManager = function(data){
      $state.go('branchOfficeManager', 
        {content:
          {
            id_BranchOffice: data._id,
            branchOfficeName: data.name
          }
      })
    }

    $scope.viewComplain = function(data){
      $state.go('complain', 
        {content:
          {
            id_BranchOffice: data._id,
            branchOfficeName: data.name
          }
      })
    }

    $scope.getBranchReport = function(data){
      var branch_id = {
        id_BranchOffice: data
      }
      var cont_pendiente = 0;
      var cont_resuelto = 0;
      var cont_no_resuelto = 0;

      ComplainService.AllComplainsByBranchOffice(branch_id).then(function(response1){
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
    }

}]);
