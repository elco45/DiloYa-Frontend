angular.module('MyApp.Services').factory('BranchOfficeManagerService', ['$http',
	function($http){
		//var baseUrl = 'https://dilo-ya.com/app2/';
		var baseUrl = 'https://dilo-ya-backend.herokuapp.com/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allBranchOfficeManagers");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getBranchOfficeManager", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/addBranchOfficeManager", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteBranchOfficeManager/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateBranchOfficeManager", payload);
	        },
	        AllBranchOfficeManagersByBranchOffice: function(payload) {
	        	//payload = id_Office
	        	return $http.post(baseUrl + "v1/allBranchOfficeManagersByBranchOffice", payload);
	        }
		};
	}
]);

