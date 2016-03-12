/*
 * https://docs.angularjs.org/api/ngResource/service/$resource
 * 
 * wegen POST zum anderen Server (localhost:8383 >> godatarest.local):
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS
 */

var godataAppIndexServices = angular.module('godataAppIndexServices', []);

godataAppIndexServices.factory('GodataIndex', ['$resource', 'restDomain',
    function ($resource, restDomain) {
        return $resource(restDomain + '/foo', {}, {
            get: {method: 'GET', cache: false, isArray: false}
        });
    }]);