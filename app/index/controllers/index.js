'use strict';

angular.module('godataAppControllers', []).controller('IndexCtrl', ['$scope', '$rootScope', 'AlertKill',
    function ($scope, $rootScope) {
        $rootScope.alerts = [{type: 'success', msg: 'jou toll'}];
        $scope.welcomeMessage = 'hello employee';
    }]);