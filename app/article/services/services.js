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
godataAppArticleServices.factory('Article', ['$resource', 'restDomain', function ($resource, restDomain) {
    return $resource(restDomain + '/article', {}, {
        get: {method: 'GET', cache: false, isArray: false}, // get one
        query: {method: 'GET', cache: false, isArray: false}, // get all
        create: {method: 'POST', cache: false, isArray: false},
        update: {method: 'PUT', cache: false, isArray: false},
        delete: {method: 'DELETE', cache: false, isArray: false}
    });
}]);
godataAppArticleServices.factory('ArticleList', ['$resource', 'restDomain', function ($resource, restDomain) {
    return $resource(restDomain + '/article-list', {}, {
        get: {method: 'GET', cache: false, isArray: false}, // get list from one article
//            query: {method: 'GET', cache: false, isArray: false},
        create: {method: 'POST', cache: false, isArray: false}, // create one article list entry
        update: {method: 'PUT', cache: false, isArray: false},
        delete: {method: 'DELETE', cache: false, isArray: false}
    });
}]);
godataAppArticleServices.factory('ArticleType', ['$resource', 'restDomain', function ($resource, restDomain) {
    return $resource(restDomain + '/article-type', {}, {
        //get: {method: 'GET', cache: false, isArray: false},
        query: {method: 'GET', cache: false, isArray: true},
        //create: {method: 'POST', cache: false, isArray: false},
        //update: {method: 'PUT', cache: false, isArray: false},
        //delete: {method: 'DELETE', cache: false, isArray: false}
    });
}]);
godataAppArticleServices.factory('ArticleGroup', ['$resource', 'restDomain', function ($resource, restDomain) {
    return $resource(restDomain + '/article-group', {}, {
        //get: {method: 'GET', cache: false, isArray: false},
        query: {method: 'GET', cache: false, isArray: true},
        //create: {method: 'POST', cache: false, isArray: false},
        //update: {method: 'PUT', cache: false, isArray: false},
        //delete: {method: 'DELETE', cache: false, isArray: false}
    });
}]);
godataAppArticleServices.factory('ArticleClass', ['$resource', 'restDomain', function ($resource, restDomain) {
    return $resource(restDomain + '/article-class', {}, {
        //get: {method: 'GET', cache: false, isArray: false},
        query: {method: 'GET', cache: false, isArray: true},
        //create: {method: 'POST', cache: false, isArray: false},
        //update: {method: 'PUT', cache: false, isArray: false},
        //delete: {method: 'DELETE', cache: false, isArray: false}
    });
}]);
godataAppArticleServices.service('ArticleTypes', ['$rootScope', 'ArticleType', function ($rootScope, ArticleType) {
    /*
     * Article types for a HTML Select and display name with id
     */
    ArticleType.query(
        function success(response) {
            //console.log('response: ' + response);
            $rootScope.articleTypes = response;
            $rootScope.articleTypes.push({"id": "0", "name": "-- none --"}); // support reset select :)
        },
        function error(errorResponse) {
            console.log("Error: " + JSON.stringify(errorResponse));
        });
}]);
godataAppArticleServices.service('ArticleGroups', ['$rootScope', 'ArticleGroup', function ($rootScope, ArticleGroup) {
    /*
     * Article groups for a HTML Select and display name with id
     */
    ArticleGroup.query(
        function success(response) {
            //console.log('response: ' + response);
            $rootScope.articleGroups = response;
            $rootScope.articleGroups.push({"id": "0", "name": "-- none --"}); // support reset select :)
        },
        function error(errorResponse) {
            console.log("Error: " + JSON.stringify(errorResponse));
        });
}]);
godataAppArticleServices.service('ArticleClasses', ['$rootScope', 'ArticleClass', function ($rootScope, ArticleClass) {
    /*
     * Article classes for a HTML Select and display name with id
     */
    var articleClasses = function () {
        ArticleClass.query(
            function success(response) {
                //console.log('response: ' + response);
                $rootScope.articleClasses = response;
                $rootScope.articleClasses.push({"id": "0", "name": "-- none --"}); // support reset select :)
//            var articleClassArr = new Array();
//            jQuery.each(response, function (key, value) {
////                        console.log('key: ' + key + '; value: ' + value + '; value.id: ' + value.id + '; value.name: ' + value.name);
//                articleClassArr[value.id] = value.name;
//            });
//            // to display text value from article_group
//            $rootScope.articleClassArr = articleClassArr;
            },
            function error(errorResponse) {
                console.log("Error: " + JSON.stringify(errorResponse));
            });
    }
    articleClasses();
}]);
/*
 * Stock
 */
godataAppArticleServices.factory('StockIn', ['$resource', 'restDomain', function ($resource, restDomain) {
    return $resource(restDomain + '/stockin', {}, {
        get: {method: 'GET', cache: false, isArray: false},
        query: {method: 'GET', cache: false, isArray: false},
        create: {method: 'POST', cache: false, isArray: false},
        update: {method: 'PUT', cache: false, isArray: false},
        delete: {method: 'DELETE', cache: false, isArray: false}
    });
}]);
