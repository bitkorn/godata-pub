'use strict';

var godataAppIndexControllers = angular.module('godataAppIndexControllers', []);

godataAppIndexControllers.controller('IndexCtrl', ['$scope', '$rootScope', 'base64', '$http', 'restDomain', 'AlertKill',
    function ($scope, $rootScope, base64, $http, restDomain) {
//        $rootScope.alerts = [{type: 'success', msg: 'jou toll'}];
        $scope.welcomeMessage = 'hello employee';

        $scope.godataLogin = function () {

            var credentialString = base64.encode($scope.username + ':' + $scope.passwd);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + credentialString;
            $http.get(restDomain + '/', null, {})
                    .then(function (result) {
                        console.log('IndexCtrl: ' + JSON.stringify(result));
                    })
                    .catch(function (result) {
                        console.log(JSON.stringify(result));
                    });
        };
    }]);