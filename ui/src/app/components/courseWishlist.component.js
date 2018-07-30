(function () {
    "use strict";

    angular.module('ati.components')
        .component('courseWishlist', {
            bindings: {
                course: '<',
                isFromMyCourse: '<',
                isWhishlist: '<',
                onAddToWishlist: '&'
            },
            templateUrl: 'components/courseWishlist.tpl.html',
            controller: courseWishlistController
        })
        ;

    function courseWishlistController(Auth) {
        this.addToWishlist = function () {
            this.onAddToWishlist(this.course);
        };
    }
})();