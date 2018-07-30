(function () {
    'use strict';

    angular.module('ati.core.auth')
        .constant('AUTH_TOKEN_NAME', 'atiToken')
        .constant('PREVIOUS_AUTH_TOKEN_NAME', 'atiPreviousAuthTokenRaw')

        .constant('USER_ROLES', {
            admin: 'ROLE_ADMIN',
            student: 'ROLE_STUDENT',
            lecturer: 'ROLE_LECTURER',
            manager: 'ROLE_MANAGER'
        })

        .constant('AUTH_EVENTS', {
            loginSuccess: 'ati.core.auth.login_success',
            registerSuccess: 'ati.core.auth.register_success',
            loginFailed: 'ati.core.auth.login_failed',
            registerFailed: 'ati.core.auth.register_failed',
            registerFailedDuplicate: 'ati.core.auth.register_failed_duplicate',
            registerInvalidContent: 'ati.core.auth.register_invalid_content',
            logoutSuccess: 'ati.core.auth.logout_success',
            sessionTimeout: 'ati.core.auth.session_timeout',
            notAuthenticated: 'ati.core.auth.not_authenticated',
            notAuthorized: 'ati.core.auth.not_authorized',
            notActivated: 'ati.core.auth.not_activated',
            locked: 'ati.core.auth.locked',
        })
    ;

})();
