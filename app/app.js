var app = angular.module('MyApp', ['ui.router','ngStorage','MyApp.Services', 'MyApp.Controllers']);
  
angular.module('MyApp.Controllers', []);
angular.module('MyApp.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('home');
	$stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/views/home.html'
        })
        .state('business', {
            url: '/negocios',
            templateUrl: '/views/business.html'
        })
}])