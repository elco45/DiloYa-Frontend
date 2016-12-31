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
        .state('businessBranchOffice', {
            url: '/mi-negocio/sucursales',
            templateUrl: '/views/businessBranchOffice.html',
            params:{content:undefined}
        })
        .state('BranchOfficeManager', {
            url: '/mi-negocio/sucursales/gerentes',
            templateUrl: '/views/branchOfficeManager.html',
            params:{content:undefined}
        })
        .state('users', {
            url: '/usuarios',
            templateUrl: '/views/user.html',
            params:{content:undefined}
        })

       // $paginationTemplateProvider.setPath('app/dirPagination.tpl.html');
}])