'use strict';

var godataAppStockControllers = angular.module('godataAppStockControllers', []);
godataAppStockControllers.controller('StockInsCtrl', ['$scope', '$location', 'StockIn', '$rootScope', '$log', '$cookies', 'AlertKill',
    function ($scope, $location, StockIn, $rootScope, $log, $cookies) { // GET

        $scope.itemsPerPage = $cookies.get("pagesize");
        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
        $scope.dateformat = $scope.formats[2];

        var executeQuery = function () {
//            var day = $scope.entry_time_from.getDate();
//            alert(day);
            StockIn.query({
                    size: $scope.itemsPerPage,
                    page: $scope.currentPage,
                    articleNo: $scope.article_no,
                    entryTimeFrom: $scope.entry_time_from,
                    entryTimeTo: $scope.entry_time_to
                },
                function success(response) {
//                    console.log("Success: " + JSON.stringify(response));
                    $scope.stockins = response.data;
                    /* Pagination */
                    $scope.totalItems = parseInt(response.count);
                    $scope.itemsPerPage = parseInt(response.size);
                    $scope.currentPage = parseInt(response.page);
//                    $rootScope.alerts = [{type: 'success', msg: 'jou toll'}];
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                });
        };
        executeQuery(); // always call for no empty site

//        $scope.setPage = function (pageNo) {
//            $scope.currentPage = pageNo;
//        };

        $scope.pageChanged = function () {
//            $log.log('Page changed to: ' + $scope.currentPage);
            executeQuery();
        };

        $scope.maxSize = 9;
        $scope.bigTotalItems = 175;
//        $scope.bigCurrentPage = 1;

        $scope.submitSearch = function () {
            $scope.currentPage = 1;
            executeQuery();
        };

        $scope.openDatepickerFrom = function () {
            $scope.datepopup.openedFrom = true;
        };
        $scope.openDatepickerTo = function () {
            $scope.datepopup.openedTo = true;
        };
        $scope.datepopup = {
            openedFrom: false,
            openedTo: false
        };

        $scope.setPagesize = function (pagesize) {
            $cookies.put('pagesize', pagesize);
        };
    }]);
godataAppStockControllers.controller('StockInNewCtrl', ['$scope', '$location', 'StockIn', '$rootScope', '$log', '$uibModal', 'AlertKill',
    function ($scope, $location, StockIn, $rootScope, $log, $uibModal) { // POST
        $scope.stock = {
            articleId: '',
            articleNo: '',
            storeId: '',
            storePlace: "",
            charge: "",
            quantity: "",
            unit: ""
        };
        $scope.stockEnter = function () {
            if ($scope.stock.articleNo === '0') {
                alert('You must enter a valid article no');
            } else {
                //console.log("stockInNew: " + JSON.stringify($scope.stock));
                StockIn.create($scope.stock,
                    function success(response) {
                        //console.log("Success: " + JSON.stringify(response));
                        $location.path('/stockEdit/' + response['id']); // comment out for testing
                        $rootScope.alerts = [{type: "success", msg: "create successful"}];
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    }
                );
            }
        };

        $scope.openSelectArticle = function () {

            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'partials/article/modal/article-select.html',
                controller: 'ArticleSelectModalInstanceCtrl',
                size: 'lg'
            });

            /*
             * result (selectedItem) parameter comes from uibModal.close(result)
             */
            modalInstance.result.then(function (selectedItem) {
                $scope.stock.articleNo = selectedItem.articleNo;
                $scope.stock.articleId = selectedItem.id;
                console.log(" stock with choosed article: " + JSON.stringify($scope.stock));
            }, function () {
//                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);
godataAppStockControllers.controller('StockInEditCtrl', ['$scope', '$location', 'StockIn', '$rootScope', '$log', '$uibModal', 'AlertKill',
    function ($scope, $location, StockIn, $rootScope, $log, $uibModal) { // POST
        /* rule: unable to edit articleNo from one stock-in entry  */
        $scope.stockEdit = function () {
            if ($scope.stock.articleNo === '0') {
                alert('You must enter a valid article no');
            } else {
                $scope.stock.articleId = $scope.stock.articleNo; // only for testing
                console.log("stockEnter: " + JSON.stringify($scope.stock));
                StockIn.create($scope.stock,
                    function success(response) {
                        console.log("Success: " + JSON.stringify(response));
//                            $location.path('/stockEdit/' + response['id']); // zum Massen hinzuadden (TEST) auskommentieren
                        $rootScope.alerts = [{type: "success", msg: "create successful"}];
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    }
                );
            }
        };

        $scope.openSelectArticle = function () {

            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'partials/article/modal/article-select.html',
                controller: 'ArticleSelectModalInstanceCtrl',
                size: 'lg'
            });

            /*
             * result (selectedItem) parameter comes from uibModal.close(result)
             */
            modalInstance.result.then(function (selectedItem) {
                $scope.stock.articleNo = selectedItem.articleNo;
                $scope.stock.articleId = selectedItem.articleId;
            }, function () {
//                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);
