'use strict';

angular.module('godataAppControllers', []).controller('IndexCtrl', ['$scope', '$rootScope', 'base64', '$http', 'restDomain', 'AlertKill',
    function ($scope, $rootScope, base64, $http, restDomain, GodataLogin) {
//        $rootScope.alerts = [{type: 'success', msg: 'jou toll'}];
        $scope.welcomeMessage = 'hello employee';

        $scope.godataLogin = function () {

            var credentialString = base64.encode($scope.username + ':' + $scope.passwd);
            $http.defaults.headers.common['Authorization'] = 'Basic ' + credentialString;
            $http.get(restDomain + '/login', null, {})
                    .then(function (result) {
                        console.log(JSON.stringify(result));
                    })
                    .catch(function (result) {
                        console.log(JSON.stringify(result));
                    });
        };
    }]);