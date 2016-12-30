angular.module('MyApp.Services').factory('UserService', ['$http',
	function($http){
		var baseUrl = 'http://localhost:8000/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allUsers");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getUser", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/addUser", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteUser/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateUser", payload);
	        }
		};
	}
]);
