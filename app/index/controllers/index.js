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
                        if (result.data.result === 1) {
                            $cookies.put('auth', credentialString);
                            $rootScope.alerts = [{type: 'success', msg: 'access granted'}];
                            $rootScope.access = true;
                        }
                    })
                    .catch(function (result) {
                        $cookies.remove('auth');
                        $http.defaults.headers.common['Authorization'] = '';
                        $rootScope.access = false;
                        console.log(JSON.stringify(result));
                    });
        };

        var checkLogin = function () {
            $http.get(restDomain + '/auth', null, {})
                    .then(function (result) {
//                        console.log('IndexCtrl: ' + JSON.stringify(result));
                        if (result.data.result === 1) {
                            $rootScope.access = true;
                        }
                    })
                    .catch(function (result) {
                        $cookies.remove('auth');
                        $http.defaults.headers.common['Authorization'] = '';
                        $rootScope.access = false;
                        console.log(JSON.stringify(result));
                    });
        };
        checkLogin();

        $scope.godataLogout = function () {
            $cookies.remove('auth');
            $http.defaults.headers.common['Authorization'] = '';
            $rootScope.access = false;
        };
    }]);