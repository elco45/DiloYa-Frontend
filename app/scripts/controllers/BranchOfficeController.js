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

    $scope.goReportsBranch = function(data){
      $scope.$sessionStorage.currentBranch = data;
      $state.go("reportsBranch");
    }

    $scope.getBranchReport = function(){
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
        $scope.lineGraph();
        
        

      })//fin complain 
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
            text: 'Porcentaje de quejas',
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
            text: 'Resultado de Quejas'
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

}]);
