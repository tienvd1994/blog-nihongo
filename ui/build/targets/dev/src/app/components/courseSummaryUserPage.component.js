(function() {
    "use strict";

    angular.module('ati.components')
        .component('courseSummaryUserPage', {
            bindings: {
                course: '<',
            },
            templateUrl: 'components/courseSummaryUserPage.tpl.html'
        })
    ;
})();