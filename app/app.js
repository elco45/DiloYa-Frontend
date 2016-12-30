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
        .state('login', {
            url: '/login',
            templateUrl: '/views/login.html'
        })
        .state('business', {
            url: '/negocios',
            templateUrl: '/views/business.html'
        })
        .state('users', {
            url: '/usuarios',
            templateUrl: '/views/user.html'
        })
}])