(function () {
    'use strict';

    FooterController.$inject = ["$rootScope", "$stateParams", "$scope", "AUTH_EVENTS", "LANG_KEY", "Auth", "Restangular", "amMoment", "RequestManager", "AlertService", "SPECIAL_CHARACTER_PATTERN", "Facebook", "UserManager", "CART_STORAGE_KEY", "$state"];
    angular.module('ati.core.layout')
        .controller('FooterController', FooterController)
        ;

    function FooterController($rootScope, $stateParams, $scope, AUTH_EVENTS, LANG_KEY, Auth, Restangular,
        amMoment, RequestManager, AlertService, SPECIAL_CHARACTER_PATTERN, Facebook, UserManager, CART_STORAGE_KEY, $state) {
        $scope.languageShown = false;
        $scope.contactShown = false;
        $scope.lang = '';
        $scope.requestSent = false;
        $scope.formProcessing = false;

        $scope.problem = '';
        $scope.problems = ['Vi phạm bản quyền', 'Vi phạm điều khoản sử dụng', 'Nội dung không phù hợp'];

        $scope.reportAbuse = {
            problem: 'Vi phạm bản quyền',
            content: ''
        };

        if (window.localStorage[LANG_KEY] && (window.localStorage[LANG_KEY] == 'vi' || window.localStorage[LANG_KEY] == 'en')) {
            $scope.lang = window.localStorage[LANG_KEY];
        } else {
            window.localStorage[LANG_KEY] = 'vi';
        }

        $scope.showLanguages = function () {
            $scope.languageShown = !$scope.languageShown;
        };

        $scope.showContact = () => {
            $scope.contactShown = !$scope.contactShown;
        };

        amMoment.changeLocale($scope.lang);

        $scope.closeModal = function () {
            AlertService.clearAll();
            $scope.contactShown = false;
        };

        $scope.selectLanguage = function (lang) {
            if (lang == 'vi' || lang == 'en') {
                $scope.lang = lang;
                window.localStorage[LANG_KEY] = lang;
                $translate.use(window.localStorage[LANG_KEY]);
                amMoment.changeLocale(lang);
            }
        };

        $scope.showContractForm = function () {
            AlertService.clearAll();
            let currentUser = Auth.getSession();

            $scope.request = {
                name: currentUser ? currentUser.name : null,
                email: currentUser ? currentUser.email : null,
                title: null,
                content: null
            };

            $('#gopy').modal('show');
        };

        $scope.isFormValidContactForm = function () {
            return $scope.contactForm.$valid;
        };

        $scope.isFormReportValid = function () {
            return $scope.reportForm.$valid;
        };

        $scope.submit = () => {
            if ($scope.formProcessing) {
                return;
            }

            $scope.formProcessing = true;

            RequestManager
                .post($scope.request)
                .then((request) => {
                    AlertService.addAlert({
                        type: 'success',
                        message: "Gửi yêu cầu thành công!"
                    });
                }, (error) => {
                    AlertService.addAlert({
                        type: 'error',
                        message: "Gửi yêu cầu không thành công!"
                    });
                }).finally(() => {
                    let currentUser = Auth.getSession();
                    $scope.formProcessing = false;

                    $scope.request = {
                        name: currentUser ? currentUser.name : null,
                        email: currentUser ? currentUser.email : null,
                        title: null,
                        content: null
                    };

                    $scope.reportAbuse = {
                        problem: 'Vi phạm bản quyền',
                        content: ''
                    };
                })
        };


        // $scope.showLogin = function () {
        //     AlertService.clearAll();
        //     $('.modal-backdrop').remove();
        //     $scope.$parent.registerShown = false;
        //     $scope.$parent.forgotPasswordShown = false;
        //     $scope.$parent.loginShown = true;
        //
        //     $('body').append('<div class="modal-backdrop fade in"></div>');
        //     $('body').addClass('modal-open');
        // };
        //
        // $scope.showRegister = function () {
        //     AlertService.clearAll();
        //     $('.modal-backdrop').remove();
        //     $scope.$parent.loginShown = false;
        //     $scope.$parent.forgotPasswordShown = false;
        //     $scope.$parent.registerShown = true;
        //
        //     $('body').append('<div class="modal-backdrop fade in"></div>');
        //     $('body').addClass('modal-open');
        // };
        //
        // $scope.showForgotPassword = () => {
        //     AlertService.clearAll();
        //     $('.modal-backdrop').remove();
        //     $scope.$parent.loginShown = false;
        //     $scope.$parent.registerShown = false;
        //     $scope.$parent.forgotPasswordShown = true;
        //
        //     $('body').append('<div class="modal-backdrop fade in"></div>');
        //     $('body').addClass('modal-open');
        // };
        //
        // $scope.closeModal = function () {
        //     $scope.$parent.loginShown = false;
        //     $scope.$parent.registerShown = false;
        //     $scope.$parent.forgotPasswordShown = false;
        //
        //     $('.modal-backdrop').remove();
        //     $('body').removeClass('modal-open');
        // };

        $scope.credentials = {
            username: '',
            password: '',
            from: 'ui'
        };

        $scope.registerData = {
            name: '',
            email: '',
            password: ''
        };

        /** LOGIN/SIGN UP SECTION **/
        $scope.formProcessing = false;

        $scope.isFormValid = function () {
            return $scope.loginForm.$valid;
        };

        $scope.isRegisterFormValid = function () {
            return $scope.registerForm.$valid;
        };

        $scope.isForgotPasswordFormValid = () => {
            return $scope.forgotPasswordForm.$valid;
        };

        $scope.sendEmail = () => {
            if ($scope.formProcessing) {
                return;
            }

            $scope.formProcessing = true;
            let email = $scope.email;

            Restangular.one('resetting').one('sendEmail').customPOST({ email: email })
                .then(
                    function () {
                        $scope.showForm = false;
                        $scope.email = '';

                        AlertService.addAlert({
                            type: 'success',
                            message: $translate.instant('RESET_PASSWORD_MODULE.SEND_EMAIL_SUCCESS', { username: email })
                        })
                    },
                    function (response) {
                        if (response.status === 404) {
                            AlertService.addAlert({
                                type: 'error',
                                message: $translate.instant('RESET_PASSWORD_MODULE.SEND_EMAIL_FAIL', { username: email })
                            });
                        } else if (response.status === 403) {
                            AlertService.addAlert({
                                type: 'error',
                                message: $translate.instant('RESET_PASSWORD_MODULE.ACCOUNT_LOCKED', { username: email })
                            });
                        } else {
                            AlertService.addAlert({
                                type: 'error',
                                message: $translate.instant('RESET_PASSWORD_MODULE.INTERNAL_ERROR')
                            });
                        }
                    })
                .finally(() => {
                    $scope.formProcessing = false;
                    $scope.email = '';
                })
                ;
        };

        /**
         * @param credentials
         */
        $scope.login = function (credentials) {
            if ($scope.formProcessing) {
                return;
            }

            $scope.formProcessing = true;

            Auth.login(credentials, true)
                .then(
                    function () {
                        let data = { redirectUrl: $stateParams.redirectUrl };
                        $scope.$parent.closeModal();
                        $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
                        $scope.loginShown = false;
                        $scope.$parent.loginShown = false;
                        $scope.currentUser = Auth.getSession();

                        // update carts.
                        var cartStorageJson = localStorage.getItem(CART_STORAGE_KEY);

                        if (cartStorageJson) {
                            let cartStorageObject = JSON.parse(cartStorageJson);

                            let obj = {
                                carts: cartStorageObject.carts && cartStorageObject.carts.length > 0 ? cartStorageObject.carts : [],
                                saveForLaters: cartStorageObject.saveForLaters && cartStorageObject.saveForLaters.length > 0
                                    ? cartStorageObject.saveForLaters : []
                            }

                            if ((cartStorageObject.carts && cartStorageObject.carts.length > 0) || (cartStorageObject.saveForLaters && cartStorageObject.saveForLaters.length > 0)) {
                                UserManager.one(Auth.getSession().id).customPUT(obj, 'updateCartAndSaveForLater')
                                    .then(function (reusult) {
                                        $state.reload();
                                    })
                                    .cath(function (error) {
                                        console.log(error);
                                    });
                            }
                        }
                    },
                    function (response) {
                        if (response.status == 423) {
                            $rootScope.$broadcast(AUTH_EVENTS.locked);
                        } else {
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        }
                    }
                )
                .finally(function () {
                    $scope.formProcessing = false;
                    $scope.credentials = {
                        username: '',
                        password: '',
                        from: 'ui'
                    };
                })
                ;
        };

        /**
         * @param data
         */
        $scope.register = function (data) {
            if ($scope.registerData.name.match(SPECIAL_CHARACTER_PATTERN)) {
                $rootScope.$broadcast(AUTH_EVENTS.registerInvalidContent, 'Tên không được chứa ký tự đặc biệt!');
                return false;
            }

            if ($scope.formProcessing) {
                return false;
            }

            $scope.formProcessing = true;

            Auth.register(data)
                .then(
                    function () {
                        $rootScope.$broadcast(AUTH_EVENTS.registerSuccess);
                        $scope.registerShown = false;
                    },
                    function (error) {
                        if (error.status === 400) {
                            $rootScope.$broadcast(AUTH_EVENTS.registerFailedDuplicate);
                        } else {
                            $rootScope.$broadcast(AUTH_EVENTS.registerFailed);
                        }
                    }
                )
                .finally(function () {
                    $scope.formProcessing = false;
                    $scope.registerData = {
                        name: '',
                        email: '',
                        password: ''
                    };
                })
                ;
        };

        $scope.$on('event:google-plus-signin-success', function (event, authResult) {
            console.log(authResult.status.method);
            if (authResult.status.method !== "AUTO") {
                gapi.client.load('plus', 'v1', function () {
                    gapi.client.plus.people.get({ userId: 'me' }).execute(function (response) {
                        console.log(response);
                        let responseEmail = _.find(response.emails, function (email) {
                            return email.type === "account";
                        });

                        let data = {
                            name: response.displayName,
                            gender: response.gender === "male" ? 0 : 1,
                            email: responseEmail.value,
                            photo: response.image.isDefault ? "" : response.image.url
                        }

                        Auth.loginGoogle(data, true)
                            .then(
                                function () {
                                    let data = { redirectUrl: $stateParams.redirectUrl };
                                    $scope.$parent.closeModal();
                                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
                                    $scope.loginShown = false;
                                    $scope.$parent.loginShown = false;
                                    $scope.currentUser = Auth.getSession();
                                    console.log($scope.currentUser);
                                },
                                function (response) {
                                    $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                                }
                            )
                            .finally(function () {
                            });
                    });
                });
            }
        });

        $scope.$on('event:google-plus-signin-failure', function (event, authResult) {
            console.log('google-plus-signin-failure');
        });


        /*region LOGIN FACEBOOK */
        $scope.loginFacebook = function () {
            Facebook.login(function (response) {
                // Do something with response.
                if (response.status === 'connected') {
                    $scope.facebookInfo();
                }
            }, { scope: 'email' });
        };

        $scope.facebookInfo = function () {
            Facebook.api('/me?fields=email,name,id,picture', function (response) {
                // console.log(response);

                let data = {
                    name: response.name,
                    // gender: response.gender === "male" ? 0 : 1,
                    email: response.email,
                    photo: response.picture.data.url,
                    facebookId: response.id
                };

                Auth.loginFacebook(data, true)
                    .then(
                        function () {
                            let data = { redirectUrl: $stateParams.redirectUrl };
                            $scope.$parent.closeModal();
                            $rootScope.$broadcast(AUTH_EVENTS.loginSuccess, data);
                            $scope.loginShown = false;
                            $scope.$parent.loginShown = false;
                            $scope.currentUser = Auth.getSession();
                            // console.log($scope.currentUser);
                        },
                        function () {
                            $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
                        }
                    )
                    .finally(function () {
                    });

            });
        };

        // $scope.getLoginStatus = function () {
        //     Facebook.getLoginStatus(function (response) {
        //         if (response.status === 'connected') {
        //             $scope.loggedIn = true;
        //         } else {
        //             $scope.loggedIn = false;
        //         }
        //     });
        // };

        // /**
        //  * Taking approach of Events
        //  */
        // $scope.$on('Facebook:statusChange', function(ev, data) {
        //     console.log('Status: ', data);
        //     if (data.status == 'connected') {
        //         $scope.$apply(function() {
        //             $scope.salutation = true;
        //             $scope.byebye     = false;
        //         });
        //     } else {
        //         $scope.$apply(function() {
        //             $scope.salutation = false;
        //             $scope.byebye     = true;
        //
        //             // Dismiss byebye message after two seconds
        //             $timeout(function() {
        //                 $scope.byebye = false;
        //             }, 2000)
        //         });
        //     }
        //
        //
        // });

        /*endregion*/

        /** END LOGIN/SIGN UP SECTION **/
    }
})();
