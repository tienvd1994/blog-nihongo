(function () {
    "use strict";

    angular.module("ati.components")
        .component("courseViewAll", {
            templateUrl: "components/courseViewAll.tpl.html",
            bindings: {
                courses: "<"
            }
        });
})();