angular.module('MyApp.Controllers')
  .controller('BranchOfficeController', ['BranchOfficeService', '$scope', '$sessionStorage', '$state',
    function (BranchOfficeService, $scope, $sessionStorage, $state) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.branchOffice = {};
    $scope.branchOffices = [];
    $scope.businessBranchOffices = [];

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
        telephone: data.telephone,
        direction: data.direction,
        id_Business: $scope.$sessionStorage.currentUser.id_Business
      };
      //user id_Business
      BranchOfficeService.Add(param).then(function(response){
        $scope.branchOffice = {};
        $scope.businessBranchOffices.push(response.data);
      });
    }

    $scope.deleteBranchOffice = function(data){
      BranchOfficeService.Delete(data).then(function(response){
        $scope.allBranchOfficesByBusiness($scope.$sessionStorage.currentUser.id_Business)
      })
    }

    $scope.updateBranchOffice = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        id_location: data.id_location,
        telephone: data.telephone,
        direction: data.direction
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
          
          var marker = new google.maps.Marker({
              position: pos,
              title:"Hello World!"
          });
          var service = new google.maps.places.PlacesService(map2);
          service.nearbySearch({
              location: pos,
              radius: 500,
              types: ['restaurant','university','cafe','food','shopping_mall','airport']
          }, $scope.callback2);
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
          
          var marker = new google.maps.Marker({
              position: pos,
              title:"Hello World"
          });
          var service = new google.maps.places.PlacesService(map3);
          service.nearbySearch({
              location: pos,
              radius: 500,
              types: ['restaurant','university','cafe','food','shopping_mall','airport']
          }, $scope.callback2);
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

    $scope.callback2 = function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        $scope.nearbyPlaces = results;
        for(var i = 0;i<$scope.nearbyPlaces.length;i++){
          console.log($scope.nearbyPlaces[i])
        }
      }
      $scope.$apply();
    }

    $scope.viewBranchOfficeManager = function(data){
      $state.go('BranchOfficeManager', 
        {content:
          {id_BranchOffice: data}
      })
    }
}]);
