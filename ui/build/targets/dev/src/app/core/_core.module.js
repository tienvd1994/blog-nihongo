(function () {
    'use strict';

    appRun.$inject = ["Auth", "EXISTING_SESSION"];
    var core = angular.module('ati.core', [
        'ui.router',

        // angular modules
        // 'ngAnimate',
        // 'ngSanitize',
        // 'pascalprecht.translate',

        // cached templates
        'templates-app',
        'templates-common',

        // ati modules
        'ati.blocks.alerts',
        'ati.blocks.serverError',
        'ati.blocks.errorPage',
        'ati.blocks.confirmClick',

        'ati.core.bootstrap',
        'ati.core.auth',
        'ati.core.router',
        'ati.core.layout',
        'ati.core.resetPassword',
        'ati.core.activate',
        'ati.core.data',
        'ati.core.language',

        // 3rd party modules
        // 'httpi',
        // 'underscore',
        // 'restangular',
        // 'angular-loading-bar',
        // 'ui.bootstrap',
        // 'angularFileUpload',
        // 'vjs.video',
        // 'angularMoment',
        // 'angular-uuid',
        // 'textAngular',
        // 'dndLists',
        // 'ui.select',
        // '720kb.socialshare',
        // 'ngclipboard',
    ]);

    core.run(appRun);

    function appRun(Auth, EXISTING_SESSION) {
        // EXISTING_SESSION set by deferred angular bootstrap
        if (EXISTING_SESSION) {
            Auth.initSession(EXISTING_SESSION);
        }
    }

    core.filter('elapsed', ["$sce", function ($sce) {
        return function (seconds) {
            if (Number.isInteger(seconds)) {
                let result = '';

                let hour = Math.floor(seconds / 3600);
                if (hour > 0 && hour < 10) {
                    result = result.concat('0', hour.toString(), ':');
                } else if (hour > 10) {
                    result = result.concat(hour.toString(), ':');
                }

                let minute = Math.floor((seconds - hour * 3600) / 60);

                if (minute > 10) {
                    result = result.concat(minute.toString(), ':');
                } else if (minute > 0 && minute < 10) {
                    result = result.concat('0', minute.toString(), ':');
                } else {
                    result = result.concat('00', ':');
                }

                let second = seconds - 3600 * hour - 60 * minute;
                if (second >= 10) {
                    result = result.concat(second.toString());
                } else {
                    result = result.concat('0', second.toString());
                }

                return result;
            }

            return seconds;
        }
    }]);

    core.filter("supplied", ["$sce", function ($sce) {
        return function (name) {
            if (!name) {
                return name;
            }

            let matches = name.match(/\b(\w)/g);
            return matches.join('').toUpperCase();
        }
    }]);

    // core.filter('level', function ($translate) {
    //     function filterLevel(key) {
    //         switch (key) {
    //             case 'all':
    //                 return $translate.instant('LEVEL_ALL');
    //             case 'beginner':
    //                 return $translate.instant('LEVEL_BEGINNER');
    //             case 'intermediate':
    //                 return $translate.instant('LEVEL_INTERMEDIATE');
    //             case 'expert':
    //                 return $translate.instant('LEVEL_EXPERT');
    //             case 'paid':
    //                 return $translate.instant('PAID');
    //             case 'free':
    //                 return $translate.instant('FREE');

    //             case '4.0':
    //                 return $translate.instant('COURSE_SEARCH.4_UP');

    //             case '3.0':
    //                 return $translate.instant('COURSE_SEARCH.3_UP');

    //             case '2.0':
    //                 return $translate.instant('COURSE_SEARCH.2_UP');

    //             default:
    //                 return key;
    //         }
    //     }

    //     filterLevel.$stateful = true;

    //     return filterLevel;
    // });

    // core.filter('percentStyle', function ($translate) {
    //     return function (value) {
    //         let percent = ((value / 5) * 100).toFixed(0);
    //         return `width: ${percent}%`;
    //     }
    // });

    core.filter('secondToHourDecimal', function () {
        return function (second) {
            let hour = second / 3600;
            return Math.round(hour * 2) / 2;
            // if (Number.isInteger(second)) {
            //     let result = (second / 3600).toFixed(1);
            //
            //     return result;
            // }
            // else {
            //     return 0;
            // }
        }
    });
})();
