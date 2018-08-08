(function () {
    "use strict";

    angular.module('ati.core.data.resources')
        .factory('CategoryManager', CategoryManager)
        ;

    function CategoryManager(Restangular) {
        let RESOURCE_NAME = 'categories';

        return Restangular.service(RESOURCE_NAME);
    }
})();