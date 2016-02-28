/**
 * Created by allapow on 26.02.16.
 */
'use strict';
angular.module('godataAppCommonServices', []).service('AlertKill', ['$rootScope', function ($rootScope) {
    $rootScope.closeAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };
}]);