(function () {
    "use strict";

    angular.module('ati.core.data.resources')
        .factory('TestManager', TestManager)
        ;

    function TestManager(Restangular) {
        let RESOURCE_NAME = 'tests';

        return Restangular.service(RESOURCE_NAME);
    }
})();