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
        templateUrl: 'partials/article/article-add.html',
        controller: 'ArticleAddCtrl'
    }).when('/articleEdit/:id', {
        templateUrl: 'partials/article/article-edit.html',
        controller: 'ArticleEditCtrl'
    }).when('/stockIns', {
        templateUrl: 'partials/stock/stock-ins.html',
        controller: 'StockInCtrl'
    }).when('/stockInEnter', {
        templateUrl: 'partials/stock/stock-in-enter.html',
        controller: 'StockInEnterCtrl'
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
