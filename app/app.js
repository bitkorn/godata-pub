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
    'godataAppArticleControllers',
    'godataAppCommonServices'
]);

godataApp.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
    $routeProvider.when('/', {
        templateUrl: 'partials/index.html',
        controller: 'IndexCtrl'
    });
    $locationProvider.html5Mode(false).hashPrefix('!');

}]);
godataApp.run(function ($rootScope, $cookies) {
    var pagesize = parseInt($cookies.get("pagesize"));
    if (!pagesize) {
//        alert("change");
        $cookies.put("pagesize", 6); // initial pagesize
    }
});
