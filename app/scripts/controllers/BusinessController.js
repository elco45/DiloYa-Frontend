angular.module('MyApp.Controllers')
  .controller('BusinessController', ['BusinessService', 'BranchOfficeService','ComplainService','$scope', '$state', '$filter', '$sessionStorage','$timeout',
    function (BusinessService, BranchOfficeService, ComplainService, $scope, $state, $filter, $sessionStorage,$timeout) {
    $scope.$sessionStorage = $sessionStorage;
    $scope.business = {};
    $scope.businesses = [];
    $scope.cont_pendiente = 0;
    $scope.cont_resuelto = 0;
    $scope.cont_no_resuelto = 0;
    $scope.array_resuelto = [];
    $scope.array_pending = [];
    $scope.array_no_resuelto = [];

    if($scope.$sessionStorage.currentBusinessReport){
      var tmp = {
        "_id": $scope.$sessionStorage.currentBusinessReport
      }
      BusinessService.Get(tmp).then(function(response){
        $scope.actualBusiness = response.data.name;
      })
    }

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

    $scope.goReportsBusiness = function(data){
      $scope.$sessionStorage.currentBusinessReport = data;
      $state.go("reports");
    }

    $scope.getBusinessReport = function(){
      if($scope.$sessionStorage.currentBusinessReport){
        var business_id = {
          id_Business: $scope.$sessionStorage.currentBusinessReport
        }
        $scope.cont_pendiente = 0;
        $scope.cont_resuelto = 0;
        $scope.cont_no_resuelto = 0;
        $scope.array_resuelto = [];
        $scope.array_pending = [];
        $scope.array_no_resuelto = [];
        
        BranchOfficeService.AllBranchOfficesByBusiness(business_id).then(function(response){
          for (var i = 0; i < response.data.length; i++) {
            var branchOffice_id = {
              id_BranchOffice: response.data[i]
            }
            ComplainService.AllComplainsByBranchOffice(branchOffice_id).then(function(response1){
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
            }) //fin del complain
          };//fin for
        })//fin de branch
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
            type: 'datetime',
            dateTimeLabelFormats: { // don't display the dummy year
                month: '%e. %b',
                year: '%b'
            },
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
            name: 'Solucionado',
            data: $scope.array_resuelto
        }, {
            name: 'Intervención de gerente nivel 2',
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
                name: 'Intervención de gerente nivel dos',
                y: $scope.cont_no_resuelto
            }]
        }]
      });
    }

    $scope.goBusiness = function(){
      $state.go('business')
    }

}]);
