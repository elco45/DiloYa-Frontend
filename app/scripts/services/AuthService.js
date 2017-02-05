angular.module('MyApp.Services').factory('AuthService', ['$http',
	function($http){
		var baseUrl = 'https://dilo-ya.com/app2';
		//var baseUrl = 'https://dilo-ya-backend.herokuapp.com/';
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

