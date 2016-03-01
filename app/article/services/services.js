/*
 * https://docs.angularjs.org/api/ngResource/service/$resource
 * 
 * wegen POST zum anderen Server (localhost:8383 >> ws.local):
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
 */

var godataAppArticleServices = angular.module('godataAppArticleServices', []);
/*
 * Article
 */
godataAppArticleServices.factory('Article', ['$resource', function ($resource) {
        return $resource('http://godatarest.local/article', {}, {
            get: {method: 'GET', cache: false, isArray: false}, // get one
            query: {method: 'GET', cache: false, isArray: false}, // get all
            create: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);
godataAppArticleServices.factory('ArticleList', ['$resource', function ($resource) {
        return $resource('http://godatarest.local/article-list', {}, {
            get: {method: 'GET', cache: false, isArray: false}, // get list from one article
//            query: {method: 'GET', cache: false, isArray: false},
            create: {method: 'POST', cache: false, isArray: false}, // create one article list entry
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);
godataAppArticleServices.factory('ArticleType', ['$resource', function ($resource) {
        return $resource('http://godatarest.local/article-type', {}, {
            get: {method: 'GET', cache: false, isArray: false},
            query: {method: 'GET', cache: false, isArray: true},
            create: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);
godataAppArticleServices.service('ArticleTypes', ['$rootScope', 'ArticleType', function ($rootScope, ArticleType) {
        /*
         * Article types for a HTML Select
         */
        ArticleType.query(
                function success(response) {
                    console.log('response: ' + response);
                    $rootScope.articleTypes = response;
                    $rootScope.articleTypes.push({"id": "0", "name": "all"}); // support reset select :)
                    var articleTypeArr = new Array();
                    jQuery.each(response, function (key, value) {
//                        console.log('key: ' + key + '; value: ' + value + '; value.id: ' + value.id + '; value.name: ' + value.name);
                        articleTypeArr[value.id] = value.name;
                    });
                    // to display text value from article_type
                    $rootScope.articleTypeArr = articleTypeArr;
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                });
    }]);
/*
 * Stock
 */
godataAppArticleServices.factory('StockIn', ['$resource', function ($resource) {
        return $resource('http://godatarest.local/stockin', {}, {
            get: {method: 'GET', cache: false, isArray: false},
            query: {method: 'GET', cache: false, isArray: false},
            create: {method: 'POST', cache: false, isArray: false},
            update: {method: 'PUT', cache: false, isArray: false},
            delete: {method: 'DELETE', cache: false, isArray: false}
        });
    }]);
