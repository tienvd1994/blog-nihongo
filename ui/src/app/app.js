angular.module('ati', [
    'ati.core',
    'ati.home',
    'ati.about',
    'ati.contact',
    'ati.detail',
    'ati.category',
    'ati.components',
    'ati.errorPage'
])
    .constant('_', window._)
    .constant('APP_EVENTS', {
        page: 1,
        per_page: 15
    })
    .run(function ($rootScope) {
        $rootScope._ = window._;
    })
    ;
