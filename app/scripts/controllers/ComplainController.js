angular.module('MyApp.Controllers')
  .controller('ComplainController', ['AuthService', '$scope', '$state', 
    function (ComplainService, $scope, $state) {
    $scope.activeView = 0;
    $scope.nearbyPlaces = [];
    $scope.selectedPlace = {};

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
              types: ['restaurant','university','cafe','food','school','shopping_mall','airport']
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
        for(var i = 0;i<$scope.nearbyPlaces.length;i++){
          console.log($scope.nearbyPlaces[i].id)
        }
      }
      $scope.$apply();
    }


}]);
