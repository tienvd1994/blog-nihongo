(function () {
    'use strict';

    angular.module('ati.core.router')
        .config(appConfig)

        .constant('BASE_USER_URLS', {
            admin: '/adm',
            doctor: '/doctor',
            assistant: '/assistant',
            clinic: '/clinic'
        })

        .constant('BASE_USER_STATES', {
            admin: 'app.admin',
            doctor: 'app.doctor',
            assistant: 'app.assistant',
            clinic: 'app.clinic'
        })
    ;

    function appConfig($urlRouterProvider) {
        $urlRouterProvider.when('', '/');

        $urlRouterProvider.when( '/terms', function ($state) { $state.go('app.term.index'); } );
        $urlRouterProvider.when( '/terms/privacy', function ($state) { $state.go('app.term.privacy'); } );
        $urlRouterProvider.when( '/error/not-found', function ($state) { $state.go('app.notFound'); } );

        $urlRouterProvider.otherwise(function($injector, $location) {
            $location.path('/error/not-found');
        });
    }
})();
