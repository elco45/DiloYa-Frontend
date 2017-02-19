angular.module('MyApp.Controllers')
  .controller('BranchOfficeController', ['BranchOfficeService', 'BranchOfficeManagerService', 'ComplainService','$scope', '$sessionStorage', '$state', '$rootScope','$timeout',
    function (BranchOfficeService, BranchOfficeManagerService, ComplainService,$scope, $sessionStorage, $state, $rootScope,$timeout) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.branchOffice = {};
    $scope.branchOffices = [];
    $scope.businessBranchOffices = [];

    $scope.cont_pendiente = 0;
    $scope.cont_resuelto = 0;
    $scope.cont_no_resuelto = 0;
    $scope.array_resuelto = [];
    $scope.array_pending = [];
    $scope.array_no_resuelto = [];

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
      if($state.params.content.branchOfficeName){
        $scope.$sessionStorage.params.branchOfficeName = $state.params.content.branchOfficeName;
      }
    }

    if($scope.$sessionStorage.currentBranch){
      var tmp = {
        "_id": $scope.$sessionStorage.currentBranch
      }
      BranchOfficeService.Get(tmp).then(function(response){
        $scope.actualBranch = response.data.name;
      })
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
        coordinates: data.coordinates,
        telephone: data.telephone,
        direction: data.direction,
        maxWaitTime: data.maxWaitTime,
        station: data.station
      };
      if ($scope.$sessionStorage.params.businessName) {
        param.id_Business = $scope.$sessionStorage.params.id_Business;
      }else{
        param.id_Business = $scope.$sessionStorage.currentUser.id_Business;
      }
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
        coordinates: data.coordinates,
        telephone: data.telephone,
        direction: data.direction,
        maxWaitTime: data.maxWaitTime,
        station: data.station
      };
      BranchOfficeService.Update(param).then(function(response){
        $scope.branchOffice = {};
        $scope.allBranchOfficesByBusiness($scope.$sessionStorage.currentUser.id_Business)
      })
    }

    $scope.allBranchOfficesByBusiness = function(data){
      if(data){
        if($scope.$sessionStorage.currentUser.scope.indexOf('superAdmin') > -1 || $sessionStorage.currentUser.scope.indexOf('admin') > -1 ){
          var param = {
            id_Business: data
          }
          BranchOfficeService.AllBranchOfficesByBusiness(param).then(function(response){
            $scope.businessBranchOffices = response.data;
          })
        }else{
          $state.go('branchOffice');
        }
      }else{
        $state.go('home');
      }
    }

    if($sessionStorage.currentUser){
        try{
          
          $scope.initMap2 = function() {
            var map2 = new google.maps.Map(document.getElementById('map2'), {
              center: {lat: -33.8688, lng: 151.2195},
              zoom: 17
            });
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
                    draggable: false
                });
                
                // To add the marker to the map, call setMap();
                marker.setMap(map2);
                google.maps.event.trigger(map2, "resize");
                map2.setCenter(pos);
              });
            } else {
              alert('browser not supported!')
            }    
          }
          $(function() {
            $('#myModalAdd').on('shown.bs.modal', function () {
            });
          });

          

          $scope.initMap3 = function() {
            var map3 = new google.maps.Map(document.getElementById('map3'), {
              center: {lat: -33.8688, lng: 151.2195},
              zoom: 17
            });
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
                    draggable: false
                });
               
                // To add the marker to the map, call setMap();
                marker.setMap(map3);
                google.maps.event.trigger(map3, "resize");
                map3.setCenter(pos);
              });
            } else {
              alert('browser not supported!')
            }    
          }

          $(function() {
            $('#myModalEdit').on('shown.bs.modal', function () {
            });
          });


        }catch(err){
          swal("Alerta!", "Se necesita que active su GPS para poder agregar un sucursal.", "warning");
        }
    }else{
      $state.go('home');
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

    $scope.goReportsBranch = function(data){
      $scope.$sessionStorage.currentBranch = data;
      $state.go("reportsBranch");
    }

    $scope.getBranchReport = function(){
      if($scope.$sessionStorage.currentBranch){
        var branch_id = {
          id_BranchOffice: $scope.$sessionStorage.currentBranch
        }
        $scope.cont_pendiente = 0;
        $scope.cont_resuelto = 0;
        $scope.cont_no_resuelto = 0;
        $scope.array_resuelto = [];
        $scope.array_pending = [];
        $scope.array_no_resuelto = [];

        ComplainService.AllComplainsByBranchOffice(branch_id).then(function(response1){
          for (var i = 0; i < response1.data.length; i++) {
            if(response1.data[i].solved == 0){
              $scope.cont_pendiente++;
              $scope.array_pending.push([Date.parse(response1.data[i].date_sent),$scope.cont_pendiente])
            }else if(response1.data[i].solved == 1){
              $scope.cont_resuelto++;
              $scope.array_resuelto.push([Date.parse(response1.data[i].date_sent),$scope.cont_resuelto])
            }else if(response1.data[i].solved == 2){
              $scope.cont_no_resuelto++;
              $scope.array_no_resuelto.push([Date.parse(response1.data[i].date_sent),$scope.cont_no_resuelto])
            }
          };
          $scope.pieChart();
        })//fin complain 
      }else{
        if($scope.$sessionStorage.currentUser){
          $state.go('business');
        }else{
          $state.go('login');
        }
      }
      
    }

    $scope.lineGraph = function(){
      Highcharts.chart('businessGraph', {
        chart: {
            events: {
              load: function() {
                $timeout(function() {
                  $('#businessGraph').highcharts().reflow();   
               });
              }
            }
        },
        title: {
            text: 'Quejas',
            x: -20 //center
        },
        xAxis: {
            type: 'datetime'  ,
            title: {
                text: 'Date'
            }
        },
        yAxis: {
            title: {
                text: 'Cantidad'
            }
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        series: [{
            name: 'Pendientes',
            data: $scope.array_pending
        }, {
            name: 'Resuelto',
            data: $scope.array_resuelto
        }, {
            name: 'No Resuelto',
            data: $scope.array_no_resuelto
        }]
      });//fin highcharts
    }

    $scope.pieChart = function(){
      Highcharts.chart('businessGraphPie', {
        chart: {
            type: 'pie',
            width: $('#businessGraph').width()
        },
        title: {
            text: 'Quejas'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                }
            }
        },
        series: [{
            name: 'Quejas',
            colorByPoint: true,
            data: [{
                name: 'Resuelto',
                y: $scope.cont_resuelto
            }, 
            {
                name: 'Pendientes',
                y: $scope.cont_pendiente
            }, 
            {
                name: 'No Resuelto',
                y: $scope.cont_no_resuelto
            }]
        }]
      });
    }

    $scope.goBranchOffice = function(){
      $state.go('adminBranchOffice', 
        {content:
          {
            id_Business: $scope.$sessionStorage.params.id_Business,
            businessName: $scope.$sessionStorage.params.businessName
          }
      })
    }

}]);
