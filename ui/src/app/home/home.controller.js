(function () {
    'use strict';

    angular.module('ati.home')
        .controller('HomeController', HomeController)
        ;

    function HomeController($scope, APP_EVENTS, TestManager) {
        $scope.tests = [];

        $scope.pagination = {
            page: APP_EVENTS.page,
            per_page: APP_EVENTS.per_page,
            totalItems: 0,
            maxSize: 5
        };

        $scope.pageChanged = function () {
            getTests($scope.pagination.page);
        };

        getTests($scope.pagination.page);

        function getTests(page) {
            TestManager.getList({
                page: page,
                per_page: $scope.pagination.per_page
            })
                .then(function (result) {
                    let result0 = result[0];

                    $scope.tests = result0.items;
                    $scope.pagination.totalItems = result0.totalItems;
                })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }
})();
