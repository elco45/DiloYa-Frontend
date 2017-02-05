angular.module('MyApp.Services').factory('BusinessService', ['$http',
	function($http){
		var baseUrl = 'https://dilo-ya.com/app2/';
		//var baseUrl = 'https://dilo-ya-backend.herokuapp.com/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allBusinesses");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getBusiness", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/addBusiness", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteBusiness/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateBusiness", payload);
	        }
		};
	}
]);

