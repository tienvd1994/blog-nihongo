(function () {
    'use strict';

    angular.module('ati.core.layout')
        .controller('HeaderController', HeaderController)
        .filter('highlight', function ($sce) {
            return function (text, phrase) {
                if (phrase) text = text.replace(new RegExp('(' + phrase + ')', 'gi'), '<strong>$1</strong>');

                return $sce.trustAsHtml(text)
            }
        })
        ;

    function HeaderController($rootScope, $scope, $timeout, $state, Auth, NotificationManager, SubcategoryManager, LectureManager, Restangular, AUTH_EVENTS, HOME_EVENTS, LANG_KEY, myCourses, MYCOURSE_EVENTS, Facebook, CART_STORAGE_KEY) {
        let currentState = $state.current.name;

        if (currentState === "app.cart.list") {
            $scope.isStateCartList = true;
        }

        if (currentState === "app.myCourses.wishlist") {
            $scope.isStateWishlist = true;
        }

        $scope.searchPhrase = $state.params.q || '';
        $scope.courseSearchResult = [];
        $scope.userSearchResult = [];
        $scope.topics = [];
        $scope.currentSubcategory = '';
        $scope.myCourses = myCourses.length > 0 ? myCourses[0].subscribeCourses : [];
        $scope.email = '';
        $scope.currentUser = Auth.getSession() || {};

        $scope.goToLectureDashboard = function () {
            $state.go('app.lecturer.teaching');
        };

        $scope.goToMyCourse = function () {
            $state.go('app.myCourses.allCourses');
        };

        $scope.onMarkAsRead = (notification) => {
            $scope.$parent.notifications.total -= 1;
            $scope.$parent.notifications.student.map(notify => {
                if (notify._id === notification._id) {
                    notify.read = true;
                    return notify;
                }
            });

            $scope.$parent.notifications.lecturer.map(notify => {
                if (notify._id === notification._id) {
                    notify.read = true;
                    return notify;
                }
            });
        };

        $scope.markAllRead = (type) => {
            if ($scope.currentUser) {
                let data = { for: type };
                NotificationManager.one($scope.currentUser.username)
                    .post('mark-all-read', data)
                    .then((result) => {
                        $scope.$parent.notifications.total -= result.nModified;
                        if (type === 'LECTURER') {
                            $scope.$parent.notifications.lecturer.map(notify => {
                                if (notify.for === type) {
                                    notify.read = true;
                                    return notify;
                                }
                            });
                        } else if (type === 'STUDENT') {
                            $scope.$parent.notifications.student.map(notify => {
                                if (notify.for === type) {
                                    notify.read = true;
                                    return notify;
                                }
                            });
                        }
                    }, (error) => {

                    })

            }
        };

        $scope.lecturerUnread = () => {
            return $scope.$parent.notifications.lecturer.filter(notify => !notify.read).length;
        };

        $scope.studentUnread = () => {
            return $scope.$parent.notifications.student.filter(notify => !notify.read).length;
        };

        $scope.goToLecture = function (event, itemCourse) {
            event.stopPropagation();
            let friendlyName = itemCourse.course.friendlyName;
            LectureManager.one(itemCourse.sectionSelected.lecture._id).get()
                .then(function (lecture) {
                    if (lecture.isQuiz)
                        $state.go("app.lecture.quiz", { friendlyName: friendlyName, lectureId: lecture._id });
                    else
                        $state.go("app.lecture.lecture", { friendlyName: friendlyName, lectureId: lecture._id });

                },
                    function (error) {
                        console.log(error);
                    }
                );
        };

        let timer;
        $scope.mouseEnter = function (event) {
            timer = $timeout(function () {
                $scope.loadTopics(event);
            }, 200);
        };

        $scope.mouseLeave = function () {
            $timeout.cancel(timer);
        };

        $scope.closeModal = function () {
            $scope.$parent.loginShown = false;
            $scope.$parent.registerShown = false;
            $scope.$parent.forgotPasswordShown = false;

            $('.modal-backdrop').remove();
            $('body').removeClass('modal-open');
        };

        let lang = window.localStorage[LANG_KEY];

        $scope.loadTopics = function (event) {
            $scope.currentSubcategory = $(event.currentTarget).data('name');
            let friendlyName = $(event.currentTarget).data('friendly-name');
            $scope.topics = [];
            SubcategoryManager.one(friendlyName).getList('topics')
                .then(function (docs) {
                    $scope.topics = docs;
                })
                .catch(function (error) {

                });
        };

        $scope.$on(AUTH_EVENTS.loginSuccess, function (event, message) {

        });
        $scope.$on(AUTH_EVENTS.notAuthenticated, function (event, message) {
            $scope.$parent.loginShown = true;
        });

        $scope.$on(HOME_EVENTS.homeSearch, function (event, message) {
            $('#headerSearch').removeClass('open');
        });

        $scope.$on(MYCOURSE_EVENTS.mycourse, function (event, data) {
            let subscribeMatch = _.findWhere($scope.myCourses, { _id: data.subscribeCourseId });
            if (subscribeMatch)
                subscribeMatch.completionRatio = data.completionRatio;
        });

        // $scope.$on(MYCOURSE_EVENTS_LEARN.mycourselearn, function (event, data) {
        //     let subscribeMatch = _.findWhere($scope.myCourses, {_id: data.subscribeCourseId});
        //     if (subscribeMatch)
        //         subscribeMatch.completionRatio = data.completionRatio;
        // });

        $scope.autoComplete = function () {
            $rootScope.$broadcast(HOME_EVENTS.headerSearch);

            if ($scope.searchPhrase.length >= 3) {
                Restangular.all('search').getList({ 'q': $scope.searchPhrase }).then(function (searchResult) {
                    $scope.userSearchResult = searchResult[1] || [];
                    $scope.courseSearchResult = searchResult[0] || [];
                });
            }
        };

        $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams, options) {
            if (toState.name !== 'app.course.search') {
                $scope.searchPhrase = '';
            }
        });

        $scope.logout = function () {
            if (Auth.getSession().facebookId)
                Facebook.logout(function () {
                    // $scope.$apply(function() {
                    // });
                });
            Auth.logout();
            var cartStorageJson = localStorage.getItem(CART_STORAGE_KEY);

            if (cartStorageJson) {
                let cartStorageObject = JSON.parse(cartStorageJson);

                if (cartStorageObject.carts && cartStorageObject.carts.length > 0) {
                    cartStorageObject.carts = [];
                }

                if (cartStorageObject.saveForLaters && cartStorageObject.saveForLaters.length > 0) {
                    cartStorageObject.saveForLaters = [];
                }

                localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartStorageObject));
            }

            $rootScope.$broadcast(AUTH_EVENTS.logoutSuccess, lang);
        };

        /**
         * Trigger when enter at textbox search course.
         */
        $scope.enter = function (event) {
            if (event.keyCode === 13) {
                let data = event.target.value;
                redirectToSearchPage(data);
            }
        };

        /**
         * Trigger when click button search.
         */
        $scope.search = function () {
            let data = $scope.searchPhrase;
            redirectToSearchPage(data);
        };

        function redirectToSearchPage(data) {
            if (data) {
                $state.go('app.course.search', {
                    q: data, topic: null, level: null,
                    price: null, ratings: null, sort: null, p: null
                });

                $("#q").blur();
            } else {
                $state.go('app.home');
            }
        }

        $timeout(function () {
            $('.overflow-nav__links li a:first').click(function () {
                var id = $(this).attr('data-id');
                $('.overflow-nav').addClass('nav-open nav-open--sub');
                $('.overflow-nav--sub').css('visibility', 'hidden');
                $('.overflow-nav--sub-sub').css('visibility', 'hidden');
                $('#' + id).css('visibility', 'visible');
            });

            $('.overflow-nav--sub > ul > li > a').click(function () {
                var id = $(this).find('.udi-next').attr('data-id');
                $('.overflow-nav').addClass('nav-open nav-open--sub-sub');
                $('.overflow-nav--sub-sub').css('visibility', 'hidden');
                $('#' + id).css('visibility', 'visible');
            });

            $('.overflow-nav--sub-sub > ul > li > a').click(function () {
                var id = $(this).find('.udi-next').attr('data-id');
                $('.overflow-nav').addClass('nav-open nav-open--sub-sub nav-open--sub-sub-sub');
                $('.overflow-nav--sub-sub-sub').css('visibility', 'hidden');
                $('#' + id).css('visibility', 'visible');
            });

            $('.overflow-nav--sub-sub header a.overflow-nav__back-bt, .overflow-nav--sub header a.overflow-nav__back-bt').click(function () {
                $('.overflow-nav').removeClass('nav-open nav-open--sub');
                $('.overflow-nav').removeClass('nav-open nav-open--sub-sub');
                $('.overflow-nav').addClass('nav-open');
            });

            $('.overflow-nav--sub-sub-sub > header a.overflow-nav__back-bt, .overflow-nav--sub-sub > header a.overflow-nav__back-bt').click(function () {
                $('.overflow-nav').removeClass('nav-open nav-open--sub-sub');
                $('.overflow-nav').removeClass('nav-open nav-open--sub-sub-sub');
                $('.overflow-nav').addClass('nav-open');
            });

            $('.overflow-nav--sub-sub header a.overflow-nav__back-bt.overflow-nav__back-ctg-bt').click(function () {
                $('.overflow-nav').removeClass('nav-open nav-open--sub');
                $('.overflow-nav').removeClass('nav-open nav-open--sub-sub');
                $('.overflow-nav').addClass('nav-open nav-open--sub');
            });

            $('.overflow-nav--sub-sub-sub > header a.overflow-nav__back-bt.overflow-nav__back-ctg-bt').click(function () {
                $('.overflow-nav').removeClass('nav-open nav-open--sub-sub');
                $('.overflow-nav').removeClass('nav-open nav-open--sub-sub-sub');
                $('.overflow-nav').addClass('nav-open nav-open--sub-sub');
            });

            $('.mobile-bt--overflow').click(function () {
                if (!$('.overflow-nav').hasClass('nav-open')) {
                    $('.overflow-nav').addClass('nav-open');
                } else {
                    $('.overflow-nav').removeClass('nav-open');
                }
            });

            $('.mobile-bt--search').click(function () {
                if (!$('.c_header__search').hasClass('search-open')) {
                    $('.c_header__search').addClass('search-open');
                } else {
                    $('.c_header__search').removeClass('search-open');
                }
            });

            $('.dropdown-toggle').click(function () {
                if (!$('.locale-dropdown').hasClass('open')) {
                    $('.locale-dropdown').addClass('open');
                } else {
                    $('.locale-dropdown').removeClass('open');
                }
            });

            $('.owl-nav .owl-prev, .owl-nav .owl-next').click(function () {
                $('#quick-view-box').removeClass('in');
            });

            $('#q').on('keyup', function (e) {
                $(this).parents('div.c_quick-search__form').find('.dropdown').addClass('open');
            });

            $(document).on('click', function (event) {
                var container = $(".overflow-nav");
                var container2 = $(".c_header__mobile-bt");
                var container3 = $('.locale-dropdown');
                var container4 = $("#q");

                if (!container4.is(event.target) && container4.has(event.target).length === 0) {
                    $('.dropdown').removeClass('open');
                }

                if ($(window).width() < 1000) {
                    if (!container.is(event.target) && container.has(event.target).length === 0 && !container2.is(event.target) && container2.has(event.target).length === 0) {
                        $('.overflow-nav').removeClass('nav-open');
                    }

                    if (!container3.is(event.target) && container3.has(event.target).length === 0) {
                        $('.locale-dropdown').removeClass('open');
                    }
                }
            });

        }, 0)
    }
})();
