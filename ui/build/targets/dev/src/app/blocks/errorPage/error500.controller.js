(function () {
    'use strict';

    angular.module('ati.blocks.errorPage')
        .controller('500ErrorController', ["AlertService", "$translate", function(AlertService, $translate) {
            AlertService.replaceAlerts({
                type: 'error',
                message: $translate.instant('ERROR_PAGE.500')
            });
        }])
    ;
})();
