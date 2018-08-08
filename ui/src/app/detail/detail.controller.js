(function () {
    'use strict';

    angular.module('ati.detail')
        .controller('Detail', Detail)
        ;

    function Detail($scope, test) {
        $scope.test = test;
    }
})();