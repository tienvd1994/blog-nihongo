(function () {
    'use strict';

    angular.module('ati.category')
        .controller('Category', Category)
        ;

    function Category($scope, tests) {
        $scope.tests = tests;
    }
})();
