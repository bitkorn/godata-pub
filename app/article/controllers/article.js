'use strict';

var godataAppArticleControllers = angular.module('godataAppArticleControllers', []);
godataAppArticleControllers.controller('ArticlesCtrl', ['$scope', '$location', 'Article', '$rootScope', '$log', '$cookies', 'ArticleTypes', 'ArticleGroups', 'ArticleClasses', 'AlertKill',
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
            Article.query({
                size: $scope.itemsPerPage,
                page: $scope.currentPage,
                articleNo: $scope.article_no,
                desc: $scope.desc_string,
                articleType: articleTypeId
            },
                    function success(response) {
                        //console.log("Success: " + JSON.stringify(response));
                        $scope.articles = response.data;
                        /* Pagination */
                        $scope.totalItems = parseInt(response.count);
                        $scope.itemsPerPage = parseInt(response.size);
                        $scope.currentPage = parseInt(response.page);
//                    $rootScope.alerts = [{type: 'success', msg: 'jou toll'}];
                        $rootScope.$broadcast('articleLoaded'); // some services look at this
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

        $scope.articleDelete = function (id) { // DELETE id
            if (confirm('You will delete article ' + id)) {
                Article.delete({id: id},
                        function success(response) {
                            //console.log("Success delete: " + JSON.stringify(response));
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
godataAppArticleControllers.controller('ArticleCtrl', ['$scope', '$routeParams', 'Article', '$rootScope', 'ArticleTypes', 'ArticleGroups', 'ArticleClasses',
    function article($scope, $routeParams, Article, $rootScope) { // GET id
        var articleId = $routeParams.id;
        Article.get({id: articleId},
                function success(response) {
//                    console.log("Success: " + JSON.stringify(response));
                    $scope.article = response.data;
                    $rootScope.$broadcast('articleLoaded'); // some services look at this
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                });
    }]);
godataAppArticleControllers.controller('ArticleNewCtrl', ['$scope', '$location', 'Article', '$rootScope', 'EmptyDefaultObjects', 'ArticleTypes', 'ArticleGroups', 'ArticleClasses',
    function ($scope, $location, Article, $rootScope, EmptyDefaultObjects) { // SAVE id
        // at first init an empty article, otherwise $scope.article is empty

        $scope.article = EmptyDefaultObjects.getData().emptyDefaultArticleNew;
        $rootScope.$broadcast('articleLoaded'); // some services look at this

        $rootScope.$on('articleTypesLoaded', function () {
            $scope.article.articleType = {
                "id": 1,
                "name": $rootScope.articleTypes[1]
            };
        });

        $rootScope.$on('articleGroupsLoaded', function () {
            $scope.article.articleGroup = {
                "id": 1,
                "name": $rootScope.articleGroups[1]
            };
        });

        $scope.articleAdd = function () {
            if ($scope.article.articleNo.length === 0 || $scope.article.articleNo === '0') {
                alert('You must enter a valid article no');
            } else {
                var tmpArticle = $scope.article;
                if (tmpArticle.articleType.id) {
                    tmpArticle.articleType = tmpArticle.articleType.id;
                }
                if (tmpArticle.articleGroup.id) {
                    tmpArticle.articleGroup = tmpArticle.articleGroup.id;
                }
                console.log("articleAdd: " + JSON.stringify(tmpArticle));
                Article.create(tmpArticle,
                        function success(response) {
                            console.log("Success add ID: " + JSON.stringify(response));
//                        $location.path('/articleEdit/' + response['id']); // comment out for testing
                        },
                        function error(errorResponse) {
                            $scope.messages = errorResponse.data.messages;
                            setDefaultSelects();
                            console.log("Error: " + JSON.stringify(errorResponse));
                        }
                );
            }
        };

        function setDefaultSelects() {
            $scope.article.articleType = {
                "id": $scope.article.articleType,
                "name": $rootScope.articleTypes[$scope.article.articleType]
            };
            $scope.article.articleGroup = {
                "id": $scope.article.articleGroup,
                "name": $rootScope.articleGroups[$scope.article.articleGroup]
            };
        }
    }]);
godataAppArticleControllers.controller('ArticleEditCtrl', ['$scope', '$routeParams', 'Article', 'ArticleList', '$rootScope',
    '$uibModal', '$route', 'ArticleTypes', 'ArticleGroups', 'ArticleClasses', 'AlertKill',
    function ($scope, $routeParams, Article, ArticleList, $rootScope, $uibModal, $route) { // UPDATE id
        var articleId = $routeParams.id;
        Article.get({id: articleId},
                function success(response) {
                    //console.log("Success: " + JSON.stringify(response));
                    $scope.article = response.data;
                    $scope.articleListCount = response.articleListCount;
                    $rootScope.$broadcast('articleLoaded'); // some services look at this
                },
                function error(errorResponse) {
                    console.log("Error: " + JSON.stringify(errorResponse));
                });

        $scope.articleEdit = function () {
            if ($scope.article.articleType.id) {
                $scope.article.articleType = $scope.article.articleType.id;
            }
            if ($scope.article.articleGroup.id) {
                $scope.article.articleGroup = $scope.article.articleGroup.id;
            }
            Article.update({id: $scope.article.id}, $scope.article,
                    function success(response) {
                        $rootScope.alerts = [{type: 'success', msg: 'saved :)'}];
                        //console.log("Success: " + JSON.stringify(response));
                        //$location.path('/articleEdit/' + response['id']); // comment out for testing
                        $rootScope.$broadcast('articleLoaded'); // some services look at this
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    });
        };

        $rootScope.$on('articleTypesLoaded', function () {
            $scope.article.articleType = {
                "id": $scope.article.articleType,
                "name": $rootScope.articleTypes[$scope.article.articleType]
            };
        });

        $rootScope.$on('articleGroupsLoaded', function () {
            $scope.article.articleGroup = {
                "id": $scope.article.articleGroup,
                "name": $rootScope.articleGroups[$scope.article.articleGroup]
            };
        });

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

        /**
         * Opens the selected article to edit the quantity and add a description for this new part-list-item.
         * @param articleListEntryEntity
         */
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
                                $rootScope.message = {
                                    type: "success",
                                    message: "create Article-Part-List-Entry-Entity successful"
                                };
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
        $scope.parentArticle = parentArticle; // put it to the scope to show in the title
        $scope.showSub = new Array();
        var executeQuery = function () {
            ArticleList.get({id: parentArticle.id}, // 
                    function success(response) {
//                        console.log("Success: " + JSON.stringify(response));
                        $scope.articleListEntries = response.data;
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    });
        };
        executeQuery();

        $scope.openSubArticleListEntries = function (articleListEntry) { // inherited from ArticleListModalUlInstanceCtrl
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
                            if (response.result === 1) {
                                $route.reload();
//                            $rootScope.message = {type: "success", message: "deleted Article-Part-List-Entry-Entity successfully"}; // funzt hier NICHT
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
        $scope.articleListEntries = null; // oh oh ...very important (if it isn't found, angular looks up to rootScope)
        var executeQuery = function () {
            ArticleList.get({id: $scope.parentArticleListEntry.articleId},
                    function success(response) {
//                        console.log("Success: " + JSON.stringify(response));
                        $scope.articleListEntries = response.data;
                    },
                    function error(errorResponse) {
                        console.log("Error: " + JSON.stringify(errorResponse));
                    });
        };
        executeQuery(); // always call for no empty site
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
            Article.query({
                size: $scope.itemsPerPage,
                page: $scope.currentPage,
                articleNo: $scope.article_no,
                desc: $scope.desc_string,
                articleType: articleTypeId
            },
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
        executeQuery(); // always call for no empty site

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
