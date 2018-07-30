(function () {
    "use strict";

    angular.module("ati.components")
        .component("courseCategoryMenu", {
            bindings: {
                category: "<",
                subcategory: "<"
            },
            templateUrl: "components/courseCategoryMenu.tpl.html",
            controller: courseCategoryMenu
        });

    function courseCategoryMenu() {
        let self = this;

        this.$onInit = function () {
            let category = self.category;
            self.category = category;
            self.currentSubcategory = self.subcategory || {};
            let subCategories = category.subCategories;
            let friendlyNameSubcategories = _.pluck(subCategories, 'friendlyName');
            let indexOfCurrentSubcategory = _.indexOf(friendlyNameSubcategories, self.currentSubcategory);

            if (indexOfCurrentSubcategory > 6) {
                subCategories = array_move(subCategories, indexOfCurrentSubcategory, 6);
            }

            self.subCategories = subCategories;
        }
    }

    function array_move(arr, old_index, new_index) {
        if (arr.length === 0) {
            return arr;
        }
        while (old_index < 0) {
            old_index += arr.length;
        }
        while (new_index < 0) {
            new_index += arr.length;
        }
        if (new_index >= arr.length) {
            var k = new_index - arr.length;
            while ((k--) + 1) {
                arr.push(undefined);
            }
        }

        arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
        return arr;
    }
})();
