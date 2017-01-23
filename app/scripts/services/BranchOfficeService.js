angular.module('MyApp.Services').factory('BranchOfficeService', ['$http',
	function($http){
		var baseUrl = 'http://localhost:8000/';
		//var baseUrl = 'https://dilo-ya-backend.herokuapp.com/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allBranchOffices");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getBranchOffice", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/addBranchOffice", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteBranchOffice/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateBranchOffice", payload);
	        },
	        AllBranchOfficesByBusiness: function(payload) {
	            return $http.post(baseUrl + "v1/allBranchOfficesByBusiness", payload);
	        },
	        GetOffice: function(payload) {
	            return $http.post(baseUrl + "v1/getOffice", payload);
	        }
		};
	}
]);

