angular.module('MyApp.Services').factory('UserService', ['$http',
	function($http){
		var baseUrl = 'https://dilo-ya-backend.herokuapp.com/';
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
	        },
	        ChangePassword: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/changePassword", payload);
	        },
	        ModifyUser: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/modifyUser", payload);
	        },
	        GetByEmail: function(payload) {
	            return $http.post(baseUrl + "v1/getUserByEmail", payload);
	        },
	        ResetPassword: function(payload) {
	            return $http.post(baseUrl + "v1/resetPassword", payload);
	        }
		};
	}
]);

