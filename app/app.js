var app = angular.module('MyApp', ['ui.router','ngStorage','MyApp.Services', 'MyApp.Controllers','angularUtils.directives.dirPagination']);
  
angular.module('MyApp.Controllers', []);
angular.module('MyApp.Services', []);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider,$paginationTemplateProvider) {
	$urlRouterProvider.otherwise('home');
	$stateProvider
        .state('home', {
            url: '/home',
            templateUrl: '/views/home.html',
            params:{content:undefined}
        })
        .state('login', {
            url: '/login',
            templateUrl: '/views/login.html',
            params:{content:undefined}
        })
        .state('business', {
            url: '/negocios',
            templateUrl: '/views/business.html',
            params:{content:undefined}
        })
        .state('branchOffice', {
            url: '/sucursales',
            templateUrl: '/views/branchOffice.html',
            params:{content:undefined}
        })
        .state('adminBranchOffice', {
            url: '/sucursales/todos',
            templateUrl: '/views/adminBranchOffice.html',
            params:{content:undefined}
        })
        .state('branchOfficeManagerLevelTwo', {
            url: '/gerentes/nivel2',
            templateUrl: '/views/branchOfficeManagerLevelTwo.html',
            params:{content:undefined}
        })
        .state('branchOfficeManager', {
            url: '/sucursales/gerentes',
            templateUrl: '/views/branchOfficeManager.html',
            params:{content:undefined}
        })
        .state('users', {
            url: '/usuarios',
            templateUrl: '/views/user.html',
            params:{content:undefined}
        })
        .state('setting', {
            url: '/ajustes',
            templateUrl: '/views/setting.html',
            params:{content:undefined}
        })


       // $paginationTemplateProvider.setPath('app/dirPagination.tpl.html');
}])