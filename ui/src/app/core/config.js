(function () {
    'use strict';

    angular.module('ati.core')
        .constant('ENTRY_STATE', 'app.home')
        .config(config)
        .constant('STATUS_PATIENT', {
            waiting: 1,
            skip: 2,
            preHealthCheck: 3,
            preHealthCheckComplete: 4,
            healthCheck: 5,
            completed: 6
        })
        .constant('STATUS_PATIENT_TEXT', {
            1: 'Waiting',
            2: 'Skip',
            3: 'Pre-Health Check',
            4: 'Pre-Health Check Complete',
            5: 'Health Check',
            6: 'Health Check completed'
        })
        .constant('MYCOURSE_EVENTS', {
            mycourse: 'mycourse'
        })
        .constant('COURSE_DELETED_EVENT', 'COURSE_DELETED')
        .constant('SPECIAL_CHARACTER_PATTERN', /[<>{}()]/)
        .constant('CART_STORAGE_KEY', 'cartStorage')
    ;

    function config($httpProvider) {
        $httpProvider.interceptors.push('authTokenInterceptor');
        $httpProvider.interceptors.push('responseErrorInterceptor');
    }
})();
