'use strict';

var godataAppIndexControllers = angular.module('godataAppIndexControllers', []);

godataAppIndexControllers.controller('IndexCtrl', ['$scope', '$rootScope', 'base64', '$http', '$cookies', 'restDomain', 'AlertKill',
    function ($scope, $rootScope, base64, $http, $cookies, restDomain) {
//        $rootScope.alerts = [{type: 'success', msg: 'jou toll'}];
        $scope.welcomeMessage = 'hello employee';

        $scope.godataLogin = function () {

            var credentialString = 'Basic ' + base64.encode($scope.username + ':' + $scope.passwd);
            $http.defaults.headers.common['Authorization'] = credentialString;
            $http.get(restDomain + '/auth', null, {})
                    .then(function (result) {
//                        console.log('IndexCtrl: ' + JSON.stringify(result));
                        if(result.data.result === 1) {
                            $cookies.put('auth', credentialString);
                            $rootScope.alerts = [{type: 'success', msg: 'access granted'}];
                        }
                    })
                    .catch(function (result) {
                        console.log(JSON.stringify(result));
                    });
        };
    }]);