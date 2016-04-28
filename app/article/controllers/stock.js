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
                        $scope.stockIns = response.data;
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
        
        $scope.formatUnixtime = function(unixtime) {
            return moment.unix(unixtime).format("DD.MM.YYYY HH:mm:ss");
        };
    }]);
godataAppStockControllers.controller('StockInNewCtrl', ['$scope', '$location', 'StockIn', '$rootScope', '$log', '$uibModal', 'AlertKill',
    function ($scope, $location, StockIn, $rootScope, $log, $uibModal) { // POST
        $scope.stockIn = {
            articleId: '',
            articleNo: '',
            storeId: '',
            storePlace: "",
            charge: "",
            quantity: "",
            unit: ""
        };
        $scope.stockNew = function () {
            if ($scope.stockIn.articleNo.length === 0 || $scope.stockIn.articleNo === '0') {
                alert('You must enter a valid article no');
            } else {
                //console.log("stockInNew: " + JSON.stringify($scope.stockIn));
                StockIn.create($scope.stockIn,
                        function success(response) {
                            //console.log("Success: " + JSON.stringify(response));
                            //$location.path('/stockInEdit/' + response['id']); // comment out for testing
                            $rootScope.alerts = [{type: "success", msg: "create successful"}];
                        },
                        function error(errorResponse) {
                            $scope.messages = errorResponse.data.messages;
                            $rootScope.alerts = [{type: "danger", msg: "create failure"}];
                            //console.log("Error: " + JSON.stringify(errorResponse));
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
                $scope.stockIn.articleNo = selectedItem.articleNo;
                $scope.stockIn.articleId = selectedItem.id;
                console.log(" stock with choosed article: " + JSON.stringify($scope.stockIn));
            }, function () {
//                $log.info('Modal dismissed at: ' + new Date());
            });
        };
    }]);
godataAppStockControllers.controller('StockInCtrl', ['$scope', '$routeParams', '$location', 'StockIn', '$rootScope', '$log', '$uibModal', 'AlertKill',
    function ($scope, $routeParams, $location, StockIn, $rootScope, $log, $uibModal) { // GET
        /* show one stock-in entry  */
        // TODO: REST API -> join article
        var stockInId = $routeParams.id;
        StockIn.query({id: stockInId},
                function success(response) {
                    $scope.stockIn = response.data;
                    $scope.stockIn.entryTimeFormated = moment.unix(response.data.entryTime).format("DD.MM.YYYY HH:mm:ss");
                    console.log("Success: " + JSON.stringify(response));
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                }
        );

    }]);

godataAppStockControllers.controller('StockInEditCtrl', ['$scope', '$routeParams', '$location', 'StockIn', '$rootScope', '$log', '$uibModal', 'AlertKill',
    function ($scope, $routeParams, $location, StockIn, $rootScope, $log, $uibModal) { // POST
        /* rule: unable to edit articleNo from one stock-in entry  */
        // TODO: REST API -> join article
        var stockInId = $routeParams.id;
        StockIn.query({id: stockInId},
                function success(response) {
                    $scope.stockIn = response.data;
                    console.log("Success: " + JSON.stringify(response));
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                }
        );
        $scope.stockEdit = function () {
            console.log("stockEdit: " + JSON.stringify($scope.stockIn));
            StockIn.update({id: $scope.stockIn.id}, $scope.stockIn,
                    function success(response) {
                        console.log("Success: " + JSON.stringify(response));
                        $rootScope.alerts = [{type: "success", msg: "edited successful"}];
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                        $rootScope.alerts = [{type: "warning", msg: "there are some errors during editing stock-in"}];
                    }
            );
        };
    }]);
