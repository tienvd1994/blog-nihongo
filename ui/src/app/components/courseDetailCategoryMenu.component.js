(function () {
    "use strict";

    angular.module("ati.components")
        .component("courseDetailCategoryMenu", {
            bindings: {
                categoriesData: "<",
                courseData: "<"
            },
            templateUrl: "components/courseDetailCategoryMenu.tpl.html",
            controller: courseDetailCategoryMenu
        });

    function courseDetailCategoryMenu() {
        let self = this;

        this.$onInit = function () {
            var categoriesSorted = _.sortBy(self.categoriesData, function (category) {
                if (!self.courseData) {
                    return 1;
                }

                return category.friendlyName === self.courseData.category.friendlyName ? 0 : 1;
            });

            self.categories = categoriesSorted;
        }
    }
})();
