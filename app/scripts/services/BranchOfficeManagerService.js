angular.module('MyApp.Services').factory('BranchManagerService', ['$http',
	function($http){
		var baseUrl = 'http://localhost:8000/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allBranchManagers");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getBranchManager", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/addBranchManager", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteBranchManager/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateBranchManager", payload);
	        }
		};
	}
]);

