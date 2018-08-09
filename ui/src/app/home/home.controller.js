(function () {
    'use strict';

    angular.module('ati.home')
        .controller('Home', Home)
        ;

    function Home($scope, APP_EVENTS) {
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
