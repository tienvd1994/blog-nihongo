(function () {
    'use strict';

    angular.module('ati.category')
        .controller('Category', Category)
        ;

    function Category($scope, tests) {
        $scope.tests = tests;

        $scope.pagination = {
            page: APP_EVENTS.page,
            per_page: APP_EVENTS.per_page,
            totalItems: 100
        };

        $scope.pageChanged = function () {
            console.log('Page changed to: ' + $scope.pagination.currentPage);
        };
    }
})();
