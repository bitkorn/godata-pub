/**
 * This is the main App app.js
 * it runs in /index.html
 * Here are things like 'login' or 'show the company logo'
 */
'use strict';

var godataApp = angular.module('godataApp', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'ui.bootstrap',
    'godataAppCommonServices',
    'godataAppIndexControllers',
    'godataAppIndexServices',
    'ab-base64'
]);

godataApp.config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {
        $routeProvider.otherwise({redirectTo: '/'});
        $routeProvider.when('/', {
            templateUrl: 'partials/index.html',
            controller: 'IndexCtrl'
        });
        $locationProvider.html5Mode(false).hashPrefix('!');
//        $httpProvider.defaults.withCredentials = true;
    }]);
godataApp.run(function ($rootScope, $cookies, $http, base64) {
    var pagesize = parseInt($cookies.get("pagesize"));
    if (!pagesize) {
//        alert("change");
        $cookies.put("pagesize", 6); // initial pagesize
    }
    if($cookies.get('auth')) {
//        var credentialString = base64.encode('allapow' + ':' + 'testtext');
        $http.defaults.headers.common['Authorization'] = $cookies.get('auth');
    }
});
godataApp.constant('restDomain', 'http://godatarest.local');
