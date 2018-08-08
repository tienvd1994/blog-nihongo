(function () {
    'use strict';

    angular.module('ati.detail')
        .config(function ($stateProvider) {
            $stateProvider
                .state('app.detail', {
                    // parent: 'anon',
                    url: '/detail/:id',
                    views: {
                        'content@app': {
                            controller: 'Detail',
                            templateUrl: 'detail/detail.tpl.html'
                        },
                        'header@app': {
                            controller: 'HeaderController',
                            templateUrl: 'core/layout/header.tpl.html'
                        }
                    },
                    resolve: {

                    },
                    data: {
                        allowAnonymous: true
                    }
                })
                ;
        })
        ;
})();
