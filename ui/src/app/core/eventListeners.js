(function () {
    'use strict';

    angular.module('ati.core')
        .run(eventListeners)
        ;

    function eventListeners($rootScope, $location, $state, AUTH_EVENTS, ENTRY_STATE, AlertService, UserStateHelper, Auth) {
        $rootScope.$on(AUTH_EVENTS.loginSuccess, function (event , data) {
            if (data.redirectUrl) {
                window.location.href = data.redirectUrl;
                // $location.path(data.redirectUrl)
            }
            // if(Auth.isAdmin() || Auth.isClinic()) {
            //     UserStateHelper.transitionRelativeToBaseState('usersManagement.doctors.list');
            // }
            // else {
            //     UserStateHelper.transitionRelativeToBaseState('management.doctorVisit.todayWorkList');
            // }
        });

        // $.notifyDefaults({
        //     offset: {
        //         x: 0,
        //         y: 0
        //     },
        //     delay: 3000,
        //     template: `<div data-notify="container" class="col-xs-12 col-sm-12 alert alert-{0}" role="alert">
        //                    <button type="button" aria-hidden="true" class="close" data-notify="dismiss">×</button>
        //                    <span data-notify="icon"></span>
        //                    <span data-notify="title">{1}</span>
        //                    <span data-notify="message">{2}</span>
        //                    <div class="progress" data-notify="progressbar">
        //                        <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>
        //                    </div>
        //                    <a href="{3}" target="{4}" data-notify="url"></a>
        //               </div>`
        // });

        $rootScope.$on(AUTH_EVENTS.loginFailed, function () {
            AlertService.addAlert({
                type: 'error',
                message: $translate.instant('EVENT_LISTENER.LOGIN_FAIL')
            });
        });

        $rootScope.$on(AUTH_EVENTS.notActivated, function () {
            AlertService.addAlert({
                type: 'error',
                message: $translate.instant('EVENT_LISTENER.LOGIN_FAIL')
            });
        });

        $rootScope.$on(AUTH_EVENTS.locked, function () {
            AlertService.addAlert({
                type: 'error',
                message: $translate.instant('EVENT_LISTENER.LOCKED')
            });
        });

        $rootScope.$on(AUTH_EVENTS.registerFailedDuplicate, function () {
            AlertService.addAlert({
                type: 'error',
                message: $translate.instant('EVENT_LISTENER.REGISTER_FAILED_DUPLICATE')
            });
        });

        $rootScope.$on(AUTH_EVENTS.registerInvalidContent, function (event, message) {
            AlertService.addAlert({
                type: 'error',
                message: message
            });
        });

        $rootScope.$on(AUTH_EVENTS.registerSuccess, function () {
            AlertService.addAlert({
                type: 'success',
                message: $translate.instant('EVENT_LISTENER.REGISTER_SUCCESS')
            });
        });


        $rootScope.$on(AUTH_EVENTS.logoutSuccess, function (event, lang) {
            $state.go(ENTRY_STATE, { lang: lang }).then(function () {
                $.notify({ message: $translate.instant('EVENT_LISTENER.LOGOUT_SUCCESS') }, { type: 'success' });
            });
        });

        $rootScope.$on(AUTH_EVENTS.notAuthenticated, function (event, data) {
            data = Object.assign(data, { page: 'login' });
            $state.go(ENTRY_STATE, data );
        });

        $rootScope.$on(AUTH_EVENTS.sessionTimeout, function () {
            $state.go(ENTRY_STATE).then(function () {
                $.notify({ message: $translate.instant('EVENT_LISTENER.SESSION_EXPIRED') }, { type: 'danger' });
            });
        });

        $rootScope.$on(AUTH_EVENTS.notAuthorized, function () {
            UserStateHelper.transitionRelativeToBaseState('error.403');
        });
    }
})();
