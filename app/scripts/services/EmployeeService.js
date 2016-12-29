angular.module('MyApp.Services').factory('EmployeeService', ['$http',
	function($http){
		var baseUrl = 'http://localhost:8000/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allEmployees");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getEmployee", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/addEmployee", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteEmployee/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateEmployee", payload);
	        }
		};
	}
]);

