(function () {
    "use strict";

    angular.module("ati.components")
        .component("sideBarRight", {
            templateUrl: "components/sideBarRight.tpl.html",
            controller: sideBarRight
        });

    function sideBarRight() {
        let self = this;

        this.$onInit = function () {
            
        }
    }
})();
