angular.module('MyApp.Controllers')
  .controller('EmployeeController', ['EmployeeService', '$scope', '$state', '$sessionStorage', 
    function (EmployeeService, $scope, $state, $sessionStorage) {
		$scope.$sessionStorage = $sessionStorage;
        $scope.employee = {};
		$scope.employees = [];

		$scope.all = function(){
    		EmployeeService.All().then(function(response){
                $scope.employees = response.data;
            })
    	}

    	$scope.get = function(data){
            var param = {
                _id: data
            }
            EmployeeService.Get(param).then(function(response){
                $scope.employee = response.data;
            })
    	}

    	$scope.add = function(data){
    		var param = {
	    		firstName: data.firstName,
		        lastName: data.lastName
	    	};
    		EmployeeService.Add(param).then(function(response){
                $scope.employee = {};
                $scope.employees.push(response.data);
            });
    	}

    	$scope.delete = function(data){
    		EmployeeService.Delete(data).then(function(response){
                $scope.all();
            })
    	}

    	$scope.update = function(data){
            var param = {
                _id: data._id,
                firstName: data.firstName,
                lastName: data.lastName
            };
    		EmployeeService.Update(param).then(function(response){
                $scope.employee = {};
                $scope.all();
            })
            
    	}

}]);
