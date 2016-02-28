'use strict';

var godataAppArticleControllers = angular.module('godataAppArticleControllers', []);
godataAppArticleControllers.controller('ArticlesCtrl', ['$scope', '$location', 'Article', '$rootScope', '$log', '$cookies', 'AlertKill', 'ArticleTypes',
    function ($scope, $location, Article, $rootScope, $log, $cookies) { // GET

        $scope.itemsPerPage = parseInt($cookies.get("pagesize"));
        var articleTypeId = 0;

        var executeQuery = function () {
            if ((angular.isDefined($scope.selectedArticleType))) {
//                console.log('jou it is');
                articleTypeId = $scope.selectedArticleType.id;
            } else {
//                console.log('no it is not');
            }
            Article.query({size: $scope.itemsPerPage, page: $scope.currentPage, articleNo: $scope.article_no, desc: $scope.desc_string, articleType: articleTypeId},
                    function success(response) {
//                    console.log("Success: " + JSON.stringify(response));
                        $scope.articles = response.data;
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
        executeQuery(); // ever call for no empty site

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

        $scope.articleDelete = function (id) { // DELETE id
            if (confirm('You will delete article ' + id)) {
                Article.delete({id: id},
                        function success(response) {
                            console.log("Success: " + JSON.stringify(response));
                            if (response['result'] === 1) {
                                executeQuery();
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error: " + JSON.stringify(errorResponse));
                        });
            }
        };

        $scope.setPagesize = function (pagesize) {
            $cookies.put('pagesize', pagesize);
        };
    }]);
godataAppArticleControllers.controller('ArticleCtrl', ['$scope', '$routeParams', 'Article',
    function article($scope, $routeParams, Article) { // GET id
        var articleId = $routeParams.id;
        Article.get({id: articleId},
                function success(response) {
//                    console.log("Success: " + JSON.stringify(response));
                    $scope.article = response;
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                });
    }]);
godataAppArticleControllers.controller('ArticleAddCtrl', ['$scope', '$location', 'Article', '$rootScope',
    function ($scope, $location, Article, $rootScope) { // SAVE id
        // init at first an empty article, otherwise $scope.article is empty
        Article.get({id: 0},
                function success(response) {
//                    console.log("Success: " + JSON.stringify(response));
                    $scope.article = response;
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                });
        $scope.articleAdd = function () {
            if ($scope.article.articleNo === '0') {
                alert('You must enter a valid article no');
            } else {
                console.log("articleAdd: " + JSON.stringify($scope.article));
                Article.create($scope.article,
                        function success(response) {
//                            console.log("Success: " + JSON.stringify(response));
                            $location.path('/articleEdit/' + response['id']); // zum Massen hinzuadden (TEST) auskommentieren
//                            $rootScope.message = {type: "success", message: "create successful"};
                        },
                        function error(errorResponse) {
                            console.log("Error: " + JSON.stringify(errorResponse));
                        }
                );
            }
        };
    }]);
godataAppArticleControllers.controller('ArticleEditCtrl', ['$scope', '$routeParams', 'Article', 'ArticleList', '$rootScope', '$uibModal', '$route', 'AlertKill',
    function articleEdit($scope, $routeParams, Article, ArticleList, $rootScope, $uibModal, $route) { // UPDATE id
        var articleId = $routeParams.id;
        Article.get({id: articleId},
                function success(response) {
//                    console.log("Success: " + JSON.stringify(response));
                    $scope.article = response;
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                });
        $scope.articleEdit = function () {
//            alert('articleEdit: ' + JSON.stringify($scope.article));
            Article.update({id: $scope.article.id}, $scope.article,
                    function success(response) {
                        $rootScope.alerts = [{type: 'success', msg: 'you have saved :)'}];
//                        console.log("Success: " + JSON.stringify(response));
//                            $location.path('/articleEdit/' + response['id']); // zum Massen hinzuadden (TEST) auskommentieren
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    });
        };

        $scope.openArticleList = function (article) {
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'partials/article/modal/article-list-ul.html',
                controller: 'ArticleListModalInstanceCtrl',
                size: 'lg',
                scope: $scope,
                resolve: {
                    parentArticle: function () {
                        return article;
                    }
                }
            });
        };

        $scope.openSelectArticleForPartList = function () { // ArticleListModalInstanceCtrl inherits this
            var modalInstance = $uibModal.open({
                animation: false,
                templateUrl: 'partials/article/modal/article-select.html',
                controller: 'ArticleSelectModalInstanceCtrl',
                size: 'lg',
                scope: $scope
            });
            /*
             * result (selectedItem) parameter comes from uibModal.close(result)
             */
            modalInstance.result.then(function (selectedItem) {
                console.log('choosed article: ' + JSON.stringify(selectedItem));
                var articleListEntryEntity = {
                    "articleIdParent": articleId,
                    "articleId": selectedItem.id,
                    "quantity": 1,
                    "desc": ""
                };
                openSelectedArticleForPartList(articleListEntryEntity);
            }, function () {
//                $log.info('Modal dismissed at: ' + new Date());
            });
        };

        var openSelectedArticleForPartList = function (articleListEntryEntity) {
            if (articleListEntryEntity.articleId > 0) {
                console.log('articleListEntryEntity: ' + JSON.stringify(articleListEntryEntity));
                var modalInstance = $uibModal.open({
                    animation: false,
                    templateUrl: 'partials/article/modal/article-selected-for-list.html',
                    controller: 'ArticleListEntryEntityModalInstanceCtrl',
                    size: 'lg',
                    scope: $scope,
                    resolve: {
                        articleListEntryEntity: function () { // put variable to controller
                            return articleListEntryEntity;
                        }
                    }
                });
                /*
                 * result (selectedItem) parameter comes from uibModal.close(result)
                 */
                modalInstance.result.then(function (articleListEntryEntity) {
                    console.log('articleListEntryEntity edited article: ' + JSON.stringify(articleListEntryEntity));
                    ArticleList.create(articleListEntryEntity,
                            function success(response) {
                                console.log("articleListEntryEntity Success: " + JSON.stringify(response));
                                $route.reload();
                                $rootScope.message = {type: "success", message: "create Article-Part-List-Entry-Entity successful"};
                            },
                            function error(errorResponse) {
                                console.log("articleListEntryEntity Error: " + JSON.stringify(errorResponse));
                            });
                }, function () {
//                $log.info('Modal dismissed at: ' + new Date());
                });
            }
        };
    }]);
godataAppArticleControllers.controller('ArticleListEntryEntityModalInstanceCtrl', ['$scope', '$rootScope', 'ArticleList', '$uibModalInstance', 'articleListEntryEntity',
    function ($scope, $rootScope, ArticleList, $uibModalInstance, articleListEntryEntity) {
        $scope.articleListEntryEntity = articleListEntryEntity;
        // modal
        $scope.ok = function () {
            $uibModalInstance.close($scope.articleListEntryEntity);
        };

        // modal
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
godataAppArticleControllers.controller('ArticleListModalInstanceCtrl', ['$scope', '$rootScope', 'ArticleList', '$log', '$uibModalInstance', 'parentArticle', '$route',
    function ($scope, $rootScope, ArticleList, $log, $uibModalInstance, parentArticle, $route) { // GET
//        console.log('articleId: ' + parentArticle);
        $scope.articleListUlLiHtmlTemplate = 'partials/article/modal/partial/article-list-ul-li.html';
        $scope.parentArticle = parentArticle; // put it to the scope to show in title
        $scope.showSub = new Array();
        var executeQuery = function () {
            ArticleList.get({id: parentArticle.id}, // 
                    function success(response) {
//                        console.log("Success: " + JSON.stringify(response));
                        $scope.articleListEntries = response;
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    });
        };
        executeQuery();

        $scope.openSubArticleListEntries = function (articleListEntry) { // inherited fromArticleListModalUlInstanceCtrl
//            console.log('articleListEntry ID: ' + articleListEntry.id);
            if ($scope.showSub[articleListEntry.id] && $scope.showSub[articleListEntry.id]['show']) {
                $scope.showSub[articleListEntry.id]['show'] = false;
            } else {
                $scope.showSub[articleListEntry.id] = new Array();
                $scope.showSub[articleListEntry.id]['show'] = true;
//                $scope.showSub[articleListEntry.id]['parentArticleId'] = articleListEntry.articleId;
            }
        };

        $scope.deleteFromList = function (articleListEntry) {
            /*
             * delete one article list entry
             */
            if (confirm('really delete article ' + articleListEntry.articleData.articleNo + ' from list?')) {
                ArticleList.delete({id: articleListEntry.id}, // 
                        function success(response) {
//                        console.log("Success: " + JSON.stringify(response));
                            if (response.result === articleListEntry.id) {
                                $route.reload();
//                            $rootScope.message = {type: "success", message: "delete Article-Part-List-Entry-Entity successful"}; // funzt hier NICHT
                            } else {
                                alert('wat war das?');
                            }
                        },
                        function error(errorResponse) {
                            console.log("Error: " + JSON.stringify(errorResponse));
                        });
            }
        };

        $scope.close = function () { // close Button
            $uibModalInstance.close();
        };
    }]);
godataAppArticleControllers.controller('ArticleListModalUlInstanceCtrl', ['$scope', 'ArticleList',
    function ($scope, ArticleList) { // GET
//        $scope.parentArticleId = $scope.parentArticleListEntry.articleId; // from ng-init
//        console.log('$scope.parentArticleListEntry.articleId: ' + $scope.parentArticleListEntry.articleId);
        $scope.articleListEntries = null; // oh oh ...very important (if they cant find, it look up to rootScope)
        var executeQuery = function () {
            ArticleList.get({id: $scope.parentArticleListEntry.articleId},
                    function success(response) {
//                        console.log("Success: " + JSON.stringify(response));
                        $scope.articleListEntries = response;
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    });
        };
        executeQuery(); // ever call for no empty site
    }]);
godataAppArticleControllers.controller('ArticleSelectModalInstanceCtrl', ['$scope', 'Article', '$log', '$cookies', '$uibModalInstance', 'ArticleTypes',
    function articles($scope, Article, $log, $cookies, $uibModalInstance) { // GET

        $scope.selectedArticle = {
            item: {}
        };
        $scope.itemsPerPage = parseInt($cookies.get("pagesize"));
        var articleTypeId = 0;

        var executeQuery = function () {
            if ((angular.isDefined($scope.selectedArticleType))) {
//                console.log('jou it is');
                articleTypeId = $scope.selectedArticleType.id;
            } else {
//                console.log('no it is not');
            }
            Article.query({size: $scope.itemsPerPage, page: $scope.currentPage, articleNo: $scope.article_no, desc: $scope.desc_string, articleType: articleTypeId},
                    function success(response) {
//                    console.log("Success: " + JSON.stringify(response));
                        $scope.articles = response.data;
                        /* Pagination */
                        $scope.totalItems = parseInt(response.count);
                        $scope.itemsPerPage = parseInt(response.size);
                        $scope.currentPage = parseInt(response.page);
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    });
        };
        executeQuery(); // ever call for no empty site

        // modal
        $scope.ok = function () {
            $uibModalInstance.close($scope.selectedArticle);
        };

        // modal
        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };

        $scope.articleRadioChange = function (article) {
            $scope.selectedArticle = article;
        };

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

        $scope.setPagesize = function (pagesize) {
            $cookies.put('pagesize', pagesize);
        };
    }]);