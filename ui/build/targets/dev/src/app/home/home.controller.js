(function () {
    'use strict';

    Home.$inject = ["$rootScope", "$state", "$location", "$stateParams", "$scope", "$timeout", "AUTH_EVENTS", "HOME_EVENTS", "popularCourses", "collections", "topics", "suggested", "bestInstructors", "CourseManager", "Restangular", "Auth"];
    angular.module('ati.home')
        .controller('Home', Home)
        ;

    function Home($rootScope, $state, $location, $stateParams, $scope, $timeout, AUTH_EVENTS, HOME_EVENTS, popularCourses, collections, topics, suggested, bestInstructors, CourseManager, Restangular, Auth) {
        if (suggested.length > 0) {
            $scope.latestViewedCourseName = suggested[0];
            $scope.latestViewedCourseFriendlyName = suggested[1];
            $scope.suggestedCourses = suggested.slice(2);
        } else {
            $scope.suggestedCourses = [];
        }

        $scope.bestInstructors = bestInstructors;
        $scope.autoCompleteShown = false;
        $scope.searchPhrase = '';
        $scope.courseSearchResult = [];
        $scope.userSearchResult = [];
        // $scope.collections = collections;
        // $scope.topics = topics;

        $scope.popularCourses = popularCourses;
        $scope.quickViewShown = false;
        $scope.currentCourse = {};

        $scope.$on(AUTH_EVENTS.loginSuccess, function () {
            $location.url($location.path());
            $state.reload();
        });

        $scope.$on(AUTH_EVENTS.logoutSuccess, function () {
            $scope.suggestedCourses = [];
        });

        $scope.$on(HOME_EVENTS.headerSearch, function () {
            $('#homeSearch').removeClass('open');
        });

        (function () {
            let page = $stateParams.page;
            switch (page) {
                case 'login':
                    if (!Auth.isAuthenticated()) {
                        $scope.$parent.showLogin();
                    }
                    break;
                case 'register':
                    if (!Auth.isAuthenticated()) {
                        $scope.$parent.showRegister();
                    }
                    break;
                case 'resetPassword':
                    $scope.$parent.showForgotPassword();
                    break;
            }

        })();

        $scope.showQuickView = function (event) {
            let friendlyName = $(event.currentTarget).data('id');
            let quickView = $('#quick-view-box');
            let width = $(event.currentTarget).find(">:first-child").width();
            let top = $(event.currentTarget).find(">:first-child").offset().top - 50;

            let box_width = quickView.width();

            let left2 = $(event.currentTarget).find(">:first-child").offset().left;
            let width_w = $(window).width();
            let checkright = parseInt((width_w / 2));

            let left;
            if (left2 > checkright) {
                left = $(event.currentTarget).find(">:first-child").offset().left - box_width;
                quickView.removeClass('right');
                quickView.addClass('left');
            } else {
                left = jQuery(event.currentTarget).find(">:first-child").offset().left + width;
                quickView.removeClass('left');
                quickView.addClass('right');
            }

            quickView.css('top', '' + top + 'px');
            quickView.css('left', '' + left + 'px');

            CourseManager.one(friendlyName).one('subscribeCourse').get({
                userId: Auth.getSession().id
            })
                .then(function (course) {
                    let carts = $scope.$parent.shoppingCarts;

                    let getByCourseId = _.filter(carts, function (cart) {
                        return cart._id === course._id;
                    });

                    if (getByCourseId.length > 0) {
                        course.hasInCarts = true;
                    }
                    
                    $scope.currentCourse = course;
                    $scope.quickViewShown = true;
                    quickView.addClass('in');
                });
        };

        $scope.hideQuickView = function () {
            $scope.quickViewShown = false;
            $('#quick-view-box').removeClass('in')
        };

        let focusBox = false, focusCard = false;
        let timer;
        $scope.mouseEnter = function (event) {
            timer = $timeout(function () {
                focusCard = true;
                $scope.showQuickView(event);
            }, 300);
        };

        $scope.mouseLeave = function () {
            $timeout.cancel(timer);
            focusCard = false;
            timer = $timeout(function () {
                if (!focusBox) {
                    $scope.hideQuickView();
                }
            }, 100);
        };

        $scope.$parent.mouseLeaveBox = function () {
            $timeout.cancel(timer);
            focusBox = false;
            timer = $timeout(function () {
                if (!focusCard)
                    $scope.hideQuickView();
            }, 100);

        };

        $scope.$parent.mouseEnterBox = function () {
            focusBox = true;
        };


        $scope.hideAutoComplete = function () {
            $scope.autoCompleteShown = false;
        };

        $scope.autoComplete = function () {
            $rootScope.$broadcast(HOME_EVENTS.homeSearch);
            Restangular.all('search').getList({ 'q': $scope.searchPhrase }).then(function (searchResult) {
                $scope.userSearchResult = searchResult[1] || [];
                $scope.courseSearchResult = searchResult[0] || [];
                $scope.autoCompleteShown = true;
            });
        };

        $scope.enter = function (event) {
            let scopePrevSibling = $scope.$$prevSibling;

            if (scopePrevSibling) {
                scopePrevSibling.enter(event);
            } else {
                return;
            }
        };

        /**
         * Trigger when click button search.
         */
        $scope.search = function () {
            let scopePrevSibling = $scope.$$prevSibling;

            if (scopePrevSibling) {
                scopePrevSibling.searchPhrase = $scope.searchPhrase;
                scopePrevSibling.search();
            } else {
                return;
            }
        };

        $timeout(function () {
            let carouselConfig = {
                controlsClass: 'owl-controls',
                navigation: false,
                navContainerClass: 'owl-nav',
                navClass: ['owl-prev', 'owl-next'],
                navText: ['<span class="udi udi-previous"></span>', '<span class="udi udi-next"></span>'],
                loop: false,
                margin: 12,
                dots: false,
                items: 4,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: true
                    },
                    450: {
                        items: 2,
                        nav: true
                    },
                    600: {
                        items: 3,
                        nav: true
                    },
                    800: {
                        items: 4,
                        nav: true,
                        loop: false
                    }
                }

            };

            $('#listteacher').owlCarousel(carouselConfig);
            $('#listteacher .owl-next').hide();
            $('#listteacher .owl-prev').hide();

            $('#listreviews').owlCarousel(carouselConfig);
            $('#listreviews .owl-next').hide();
            $('#listreviews .owl-prev').hide();

            $('#listpartners').owlCarousel({
                controlsClass: 'owl-controls',
                navigation: false,
                navContainerClass: 'owl-nav',
                navClass: ['owl-prev', 'owl-next'],
                navText: ['<span class="udi udi-previous"></span>', '<span class="udi udi-next"></span>'],
                loop: false,
                margin: 12,
                dots: false,
                items: 4,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: true
                    },
                    450: {
                        items: 2,
                        nav: true
                    },
                    600: {
                        items: 3,
                        nav: true
                    },
                    800: {
                        items: 4,
                        nav: true
                    },
                    1000: {
                        items: 6,
                        nav: true,
                        loop: false
                    }
                }

            });
            $('#listpartners .owl-next').hide();
            $('#listpartners .owl-prev').hide();

            $('.owl-carousel').owlCarousel({
                controlsClass: 'owl-controls',
                navContainerClass: 'owl-nav',
                navClass: ['owl-prev', 'owl-next'],
                navText: ['<span class="udi udi-previous"></span>', '<span class="udi udi-next"></span>'],
                loop: true,
                margin: 12,
                dots: false,
                responsiveClass: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: true
                    },
                    450: {
                        items: 2,
                        nav: true
                    },
                    600: {
                        items: 3,
                        nav: true
                    },
                    800: {
                        items: 4,
                        nav: true
                    },
                    1000: {
                        items: 4,
                        nav: true,
                        loop: true
                    }
                }
            });

            $('#q').on('keyup', function (e) {
                $(this).parents('div.c_quick-search__form').find('.dropdown').addClass('open');
            });

            // $(document).on('click', function (event) {
            //     var container4 = $('.owl-carousel');
            //     var container5 = $('#quick-view-box');
            //     var container2 = $("#q");
            //
            //     if (!container2.is(event.target) && container2.has(event.target).length === 0) {
            //         $scope.hideAutoComplete();
            //     }
            //
            //     if (!container4.is(event.currentTarget) && container4.has(event.currentTarget).length === 0 && !container5.is(event.currentTarget) && container5.has(event.currentTarget).length === 0) {
            //         $scope.hideQuickView();
            //     }
            // });
        }, 0);

    }
})();
