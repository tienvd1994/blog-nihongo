angular.module('ati', [
    'ati.core',
    'ati.home',
    'ati.errorPage'
])
    // .config(function (FacebookProvider) {
    //     // Set your appId through the setAppId method or
    //     // use the shortcut in the initialize method directly.
    // })
    .constant('_', window._)
    .run(["$rootScope", function ($rootScope) {
        $rootScope._ = window._;
    }])
;
