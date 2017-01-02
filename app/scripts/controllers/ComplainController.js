angular.module('MyApp.Controllers')
  .controller('ComplainController', ['ComplainService','BranchOfficeService','BranchOfficeManagerService','BranchOfficeManagerLevelTwoService','$scope', '$state', '$sessionStorage', '$timeout', '$filter',
    function (ComplainService, BranchOfficeService, BranchOfficeManagerService, BranchOfficeManagerLevelTwoService, $scope, $state, $sessionStorage, $timeout, $filter) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.activeView = 0;
    $scope.nearbyPlaces = [];
    $scope.selectedPlace = {};
    $scope.complain = {};
    $scope.complains = [];
    $scope.branch_office = [];

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

    $scope.callback = function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
        $scope.nearbyPlaces = results;
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
      var temp = {
        id_BranchOffice: data.branchOffice._id
      }
      BranchOfficeManagerService.AllBranchOfficeManagersByBranchOffice(temp).then(function(response){
        var content = {
          telephone: data.telephone,
          email: data.email,
          message: data.message,
          table: data.table,
          name: data.name,
          branchOffice: data.branchOffice,
          extraDescription: null,
          contact: response.data,
          date: $filter('date')(new Date(), 'MM/dd/yyyy')
        }
        ComplainService.Add(content).then(function(response2){
          var complain_content = {
            id_complain: response2.data._id,
            id_business: data.branchOffice.id_Business,
            id_sucursal: data.branchOffice._id
          }
          $scope.complain = {};
          $scope.complains.push(response.data);
          $scope.$sessionStorage.complain = complain_content
          $state.go("second_complain")
        })

      })
    }

    $scope.deleteComplain = function(data){
      ComplainService.Delete(data).then(function(response){
        $scope.allComplains();
      })
    }

    $scope.updateComplain = function(data){
      var param = {
        _id: data._id,
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
        $scope.complains.reverse();
      })
    }

    $scope.getBranchOffice = function(){
      BranchOfficeService.All().then(function(response){
        var options = {
            enableHighAccuracy: true
        };

        navigator.geolocation.getCurrentPosition(function(pos) {
          $scope.position = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          var coordenadas = JSON.stringify($scope.position).split(",")
          var coordenadas2 = []
          for (var i = 0; i < coordenadas.length; i++) {
            var temp = [];
            temp = coordenadas[i].split(":")
            coordenadas2.push(temp[1])
          };

          var lat1 = coordenadas2[0];
          var lon1 = coordenadas2[1].substr(0,coordenadas2[1].length - 1);
          var mult=1.1;
          var radius = 5000;//distancia

          var p1 = $scope.calculateDerivedPosition(lat1,lon1, mult * radius, 0);
          var p2 = $scope.calculateDerivedPosition(lat1,lon1, mult * radius, 90);
          var p3 = $scope.calculateDerivedPosition(lat1,lon1, mult * radius, 180);
          var p4 = $scope.calculateDerivedPosition(lat1,lon1, mult * radius, 270);

          //obtener toda las coordenadas de los sucursales
          var coordenadas_sucursales = [];
          for (var i = 0; i < response.data.length; i++) {
            var temp = JSON.parse(response.data[i].coordinates)
            if((Number(temp.lat) > Number(p3.lat)) && (Number(temp.lat) < Number(p1.lat)) 
              && (Number(temp.lng) > Number(p4.lon)) && (Number(temp.lng) < Number(p2.lon))){
                coordenadas_sucursales.push(temp);
            }
            
          };

          //obtener los sucursales afiliados que esten cerca
          for (var i = 0; i < coordenadas_sucursales.length; i++) {
            if($scope.getDistanceBetweenTwoPoints(parseFloat(coordenadas_sucursales[i].lat),parseFloat(coordenadas_sucursales[i].lng),lat1,lon1) <= radius){
              $scope.branch_office.push(response.data[i]);
            }
          }
          $scope.$apply();
        },  
        function(error) {    
            $scope.branch_office = response.data;     
            swal("Alerta!", "Active su GPS para mostrar los lugares cercanos a usted.", "warning");
        }, options);
      })
    }

    $scope.calculateDerivedPosition = function(latitude,longitude,distance,bearing){
      var EarthRadius = 6371000;
      var latA = toRad(latitude);
      var lonA = toRad(longitude);
      var angularDistance = distance / EarthRadius;
      var trueCourse = toRad(bearing);

      var latB = Math.asin(
              Math.sin(latA) * Math.cos(angularDistance) +
                      Math.cos(latA) * Math.sin(angularDistance)
                      * Math.cos(trueCourse));

      var dlon = Math.atan2(
              Math.sin(trueCourse) * Math.sin(angularDistance)
                      * Math.cos(latA),
              Math.cos(angularDistance) - Math.sin(latA) * Math.sin(latB));

      var lonB = ((lonA + dlon + Math.PI) % (Math.PI * 2)) - Math.PI;

      latB = toDeg(latB);
      lonB = toDeg(lonB);

      var newPoint = {
        lat: latB,
        lon: lonB
      }
      return newPoint;
    }

    $scope.getDistanceBetweenTwoPoints = function( latitudeA,longitudeA,latitudeB,longitudeB) {
        var R = 6371000; 
        var dLat = toRad(latitudeB - latitudeA);
        var dLon = toRad(longitudeB - longitudeA);
        var lat1 = toRad(latitudeA);
        var lat2 = toRad(latitudeB);

        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2)
                * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        var d = R * c;

        return d;
    }

    function toRad(Value) {
      return Value * (Math.PI / 180);
    }
    function toDeg(Value) {
      return Value * (180 / Math.PI);
    }

    $scope.saveComplainSolved = function(){
      var temp = {
        id: $scope.$sessionStorage.complain.id_complain,
        queja: $scope.complain.extraDescription
      }
      ComplainService.Update(temp).then(function(response){
        $('#myModalYes').modal('hide');
        swal({
          title: "Exito",
          text: "Gracias por su paciencia!",
          type: "success",
          confirmButtonClass: "btn-primary",
          confirmButtonText: "Aceptar",
          closeOnConfirm: true
        },
        function(){
          $state.go("home")
        });
      })
    }

    $scope.sendSecondComplain = function(){
      var temp = {
        id_Business: $scope.$sessionStorage.complain.id_business
      }
      BranchOfficeManagerLevelTwoService.AllBranchOfficeManagersLevelTwoByBusiness(temp).then(function(response){
        var content = {
          id: $scope.$sessionStorage.complain.id_complain,
          queja: $scope.complain.extraDescription,
          contact: response.data
        }
        ComplainService.SendSecondComplain(content).then(function(response2){
          $('#myModalNo').modal('hide');
          swal({
            title: "Lo sentimos!",
            text: "Se ha enviado un mensaje a un gerente de mayor rango, pronto se pondrá en contacto con usted.",
            type: "success",
            confirmButtonClass: "btn-primary",
            confirmButtonText: "Aceptar",
            closeOnConfirm: true
          },
          function(){
            $state.go("home")
          });
        })

      })
    }

    $scope.timeout = function(){
      var param = {
        id: $scope.$sessionStorage.complain.id_sucursal
      }
      BranchOfficeService.GetOffice(param).then(function(response){
        var duration_ms = response.data.maxWaitTime*60*1000;//en milisegundos
        var duration_s = duration_ms/1000;
        countdown( "countdown", 0, duration_s );
        $timeout( function(){ 
          $("#no_help").prop('disabled', false);
        }, duration_ms);
      })
      
    }

    function countdown( elementName, minutes, seconds ){
      var element, endTime, hours, mins, msLeft, time;
      function twoDigits( n ){
        return (n <= 9 ? "0" + n : n);
      }

      function updateTimer(){
        msLeft = endTime - (+new Date);
        if ( msLeft < 1000 ) {
            element.innerHTML = "Se acabo el tiempo!";
        } else {
            time = new Date( msLeft );
            hours = time.getUTCHours();
            mins = time.getUTCMinutes();
            element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
            setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
        }
      }

      element = document.getElementById( elementName );
      endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
      updateTimer();
    }

    $scope.viewBranchOffice = function(){
      $state.go('adminBranchOffice')
    }
}]);
