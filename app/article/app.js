/**
 * This is the Article App app.js
 * it runs in /article.html
 * Here you can view and edit articles and their part lists
 */
'use strict';

var godataAppArticle = angular.module('godataAppArticle', [
    'ngRoute',
    'ngResource',
    'ngAnimate',
    'ngCookies',
    'ui.bootstrap',
    'godataAppCommonServices',
    'godataAppArticleControllers',
    'godataAppStockControllers',
    'godataAppArticleServices'
]);

godataAppArticle.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
    $routeProvider.otherwise({redirectTo: '/'});
    $routeProvider.when('/', {
        templateUrl: 'partials/article/articles.html',
        controller: 'ArticlesCtrl'
    }).when('/article/:id', {
        templateUrl: 'partials/article/article.html',
        controller: 'ArticleCtrl'
    }).when('/articleNew', {
        templateUrl: 'partials/article/article-new.html',
        controller: 'ArticleNewCtrl'
    }).when('/articleEdit/:id', {
        templateUrl: 'partials/article/article-edit.html',
        controller: 'ArticleEditCtrl'
    }).when('/stockIns', {
        templateUrl: 'partials/stock/stock-ins.html',
        controller: 'StockInsCtrl'
    }).when('/stockIn/:id', {
        templateUrl: 'partials/stock/stock-in.html',
        controller: 'StockInCtrl'
    }).when('/stockInNew', {
        templateUrl: 'partials/stock/stock-in-new.html',
        controller: 'StockInNewCtrl'
    }).when('/stockInEdit/:id', {
        templateUrl: 'partials/stock/stock-in-edit.html',
        controller: 'StockInEditCtrl'
    });
    $locationProvider.html5Mode(false).hashPrefix('!');

}]);
godataAppArticle.run(function ($rootScope, $cookies) {
    var pagesize = parseInt($cookies.get("pagesize"));
    if (!pagesize) {
//        alert("change");
        $cookies.put("pagesize", 6); // initial pagesize
    }
});
godataAppArticle.constant('restDomain', 'http://godatarest.local');