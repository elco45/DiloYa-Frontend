angular.module('MyApp.Controllers')
  .controller('ComplainController', ['AuthService', '$scope', '$state', '$sessionStorage', 
    function (ComplainService, $scope, $state, $sessionStorage) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.activeView = 0;
    $scope.nearbyPlaces = [];
    $scope.selectedPlace = {};
    $scope.complain = {};
    $scope.complains = [];

    $scope.initMap = function() {
      var map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: -34.397, lng: 150.644},
        zoom: 17
      });

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
          var service = new google.maps.places.PlacesService(map);
          service.nearbySearch({
              location: pos,
              radius: 500,
              types: ['restaurant','university','cafe','food','shopping_mall','airport']
          }, $scope.callback);
          // To add the marker to the map, call setMap();
          marker.setMap(map);
          map.setCenter(pos);
        });
      } else {
        alert('browser not supported!')
      }
    }

    $scope.callback = function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        $scope.nearbyPlaces = results;
        /*for(var i = 0;i<$scope.nearbyPlaces.length;i++){
          console.log($scope.nearbyPlaces[i].id)
        }*/
      }
      $scope.$apply();
    }

    $scope.allComplains = function(){
      ComplainService.All().then(function(response){
        $scope.complains = response.data;
      })
    }

    $scope.getComplain = function(data){
      var param = {
        _id: data
      }
      ComplainService.Get(param).then(function(response){
        $scope.complain = response.data;
      })
    }

    $scope.addComplain = function(data){
      var param = {
        name: data.name,
        telephone: data.telephone,
        email: data.email,
        subject: data.subject,
        message: data.message,
        table: data.table,
        id_BranchOffice: data.id_BranchOffice
      };
      ComplainService.Add(param).then(function(response){
        $scope.complain = {};
        $scope.complains.push(response.data);
      });
    }

    $scope.deleteComplain = function(data){
      ComplainService.Delete(data).then(function(response){
        $scope.allComplains();
      })
    }

    $scope.updateComplain = function(data){
      var param = {
        _id: data._id,
        name: data.name,
        telephone: data.telephone,
        email: data.email,
        subject: data.subject,
        message: data.message,
        table: data.table
      };
      ComplainService.Update(param).then(function(response){
        $scope.complain = {};
        $scope.allComplains();
      })
    }

    $scope.allComplainsByBranchOffice = function(data){
      var param = {
        id_BranchOffice: data.id_BranchOffice
      }
      ComplainService.AllComplainsByBranchOffice(param).then(function(response){
        $scope.complains = response.data;
      })
    }
}]);
