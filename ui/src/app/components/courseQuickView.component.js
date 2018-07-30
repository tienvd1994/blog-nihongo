(function () {
    "use strict";

    angular.module('ati.components')
        .component('courseQuickView', {
            bindings: {
                course: '<',
                onAddToWishlist: '&',
                onAddToCart: '&',
                onEnroll: '&'
            },
            templateUrl: 'components/courseQuickView.tpl.html',
            controller: courseQuickViewController
        })
        ;

    function courseQuickViewController(Auth, $timeout) {
        this.addToWishlist = function () {
            this.onAddToWishlist(this.course);
        };

        this.addToCart = function () {
            this.onAddToCart(this.course);
        };

        this.enroll = function () {
            this.onEnroll(this.course);
            // ui-sref="app.course.enroll({courseId: '{{$ctrl.course._id}}'})"
        };

        this.isInstructor = function () {
            if (!Auth.getSession()) {
                return false;
            }

            if (!this.course) {
                return false;
            }

            if (!this.course.instructor) {
                return false;
            }

            return Auth.getSession().username === this.course.instructor.username;
        };

        $timeout(function () {
            $('.quick-view-box').slimScroll({
                height: '160px'
            });
        });
    }
})();