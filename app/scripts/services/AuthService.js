angular.module('MyApp.Services').factory('AuthService', ['$http',
	function($http){
		var baseUrl = 'http://localhost:8000/';
		return {
			Logout: function(){
				return $http.get(baseUrl + "v1/logout");
			},
			Login: function(payload){
				return $http.post(baseUrl + "v1/login", payload);
			}
		};
	}
]);
