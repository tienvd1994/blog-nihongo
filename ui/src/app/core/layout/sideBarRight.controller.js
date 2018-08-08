(function () {
    'use strict';

    angular.module('ati.core.layout')
        .controller('SideBarRightController', SideBarRightController)
        ;

    function SideBarRightController($scope, CategoryManager) {
        $scope.categories = [];

        CategoryManager.getList()
            .then((result) => {
                $scope.categories = result;
            })
            .catch((error) => {
                console.log(error);
            })
    }
})();
