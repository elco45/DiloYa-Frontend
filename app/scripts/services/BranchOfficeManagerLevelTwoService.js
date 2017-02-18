angular.module('MyApp.Services').factory('BranchOfficeManagerLevelTwoService', ['$http',
	function($http){
		var baseUrl = 'https://dilo-ya.com/app2/';
		//var baseUrl = 'https://dilo-ya-backend.herokuapp.com/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allBranchOfficeManagersLevelTwo");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getBranchOfficeManagerLevelTwo", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/addBranchOfficeManagerLevelTwo", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteBranchOfficeManagerLevelTwo/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateBranchOfficeManagerLevelTwo", payload);
	        },
	        AllBranchOfficeManagersLevelTwoByBusiness: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/allBranchOfficeManagersLevelTwoByBusiness", payload);
	        }
		};
	}
]);

