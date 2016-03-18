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
        }).when('/testlogin', {
            templateUrl: 'partials/textlogin.html',
            controller: 'TestLoginCtrl'
        });
        $locationProvider.html5Mode(false).hashPrefix('!');
        $httpProvider.defaults.withCredentials = true;
    }]);
godataApp.run(function ($rootScope, $cookies) {
    var pagesize = parseInt($cookies.get("pagesize"));
    if (!pagesize) {
//        alert("change");
        $cookies.put("pagesize", 6); // initial pagesize
    }
});
godataApp.constant('restDomain', 'http://godatarest.local');
