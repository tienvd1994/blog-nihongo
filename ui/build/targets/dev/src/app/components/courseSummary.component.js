(function() {
    "use strict";

    angular.module('ati.components')
        .component('courseSummary', {
            bindings: {
                course: '<',
            },
            templateUrl: 'components/courseSummary.tpl.html'
        })
    ;
})();