angular.module('MyApp.Services').factory('BranchManagerLevelTwoService', ['$http',
	function($http){
		var baseUrl = 'http://localhost:8000/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allBranchManagersLevelTwo");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getBranchManagerLevelTwo", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/addBranchManagerLevelTwo", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteBranchManagerLevelTwo/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateBranchManagerLevelTwo", payload);
	        }
		};
	}
]);

