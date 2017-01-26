angular.module('MyApp.Services').factory('ComplainService', ['$http',
	function($http){
		var baseUrl = 'http://localhost:8000/';
		//var baseUrl = 'https://dilo-ya-backend.herokuapp.com/';
		return {
			All: function() {
	            return $http.get(baseUrl + "v1/allComplains");
	        },
	        Get: function(payload) {
	            return $http.post(baseUrl + "v1/getComplain", payload);
	        },
	        Add: function(payload) {
	        	//payload = data to add
	        	console.log(payload)
	            return $http.post(baseUrl + "v1/addComplain", payload);
	        },
	        Delete: function(payload) {
	        	return $http.delete(baseUrl + "v1/deleteComplain/" + payload);
	        },
	        Update: function(payload) {
	        	//payload = data to update
	        	return $http.post(baseUrl + "v1/updateComplain", payload);
	        },
	        AllComplainsByBranchOffice: function(payload) {
	        	//payload = id_BranchOffice
	        	return $http.post(baseUrl + "v1/allComplainsByBranchOffice", payload);
	        },
	        SendSecondComplain: function(payload) {
	        	//payload = data to add
	            return $http.post(baseUrl + "v1/sendSecondComplain", payload);
	        }
		};
	}
]);

