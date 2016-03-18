'use strict';

var godataAppIndexControllers = angular.module('godataAppIndexControllers', []);

godataAppIndexControllers.controller('IndexCtrl', ['$scope', '$rootScope', 'base64', '$http', 'restDomain', 'AlertKill',
    function ($scope, $rootScope, base64, $http, restDomain) {
//        $rootScope.alerts = [{type: 'success', msg: 'jou toll'}];
        $scope.welcomeMessage = 'hello employee';

        $scope.godataLogin = function () {

            var credentialString = base64.encode($scope.username + ':' + $scope.passwd);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + credentialString;
            $http.get(restDomain + '/login', null, {})
                    .then(function (result) {
                        console.log('---');
                        console.log(JSON.stringify(result));
                        if (result.data.result === 1) {
//                            $cookies.put('sessionid', result.data.data);
                        }
                        console.log('---');
                    })
                    .catch(function (result) {
                        console.log(JSON.stringify(result));
                    });
        };
    }]);
godataAppIndexControllers.controller('TestLoginCtrl', ['$scope', '$rootScope', '$http', 'restDomain', 'AlertKill',
    function ($scope, $rootScope, $http, restDomain) {
//        $rootScope.alerts = [{type: 'success', msg: 'jou toll'}];

        $http.get(restDomain + '/testlogin/5', null, {})
                .then(function (result) {
                    console.log('testlogin: ' + JSON.stringify(result));
                })
                .catch(function (result) {
                    console.log(JSON.stringify(result));
                });
    }]);